# -*- coding: utf-8 -*-
"""Validate a GVO editorial Excel file without importing it into runtime."""

from __future__ import annotations

import argparse
import json
import re
import sys
import tempfile
import zipfile
from pathlib import Path
from xml.etree import ElementTree


EXPECTED_COLUMNS = [
    "Bloque",
    "Orden",
    "Slot ID",
    "Emisor",
    "Texto base / intención",
    "Texto final",
    "Alternativa corta",
    "Idioma",
    "Estado de revisión",
    "Notas escritor",
    "Notas implementación",
]

ALLOWED_LANGUAGES = {"es", "en"}
ALLOWED_STATUSES = {"TEMP", "BORRADOR", "EN_REVISION", "APROBADO", "FINAL", "DESCARTADO"}
FINAL_STATUSES = {"APROBADO", "FINAL"}
SOURCE_FILES = [
    "src/content/transitionEditorialSlots.ts",
    "src/content/world2EditorialSlots.ts",
    "src/content/world3EditorialSlots.ts",
    "src/content/world4EditorialSlots.ts",
    "src/content/world5EditorialSlots.ts",
    "src/content/finalEditorialSlots.ts",
]
SLOT_ID_RE = re.compile(r"['\"]((?:TRANS|W[2-5]|FINAL)_[A-Z0-9_]+)['\"]")

HEADER_ALIASES = {
    "Bloque": ["bloque", "block"],
    "Orden": ["orden", "order"],
    "Slot ID": ["slot id", "slotid", "id", "slot"],
    "Emisor": ["emisor", "emitter"],
    "Texto base / intención": [
        "texto base / intencion",
        "texto base intencion",
        "intencion",
        "intention",
        "base text",
    ],
    "Texto final": ["texto final", "text", "final text"],
    "Alternativa corta": ["alternativa corta", "shorttext", "short text"],
    "Idioma": ["idioma", "locale", "language"],
    "Estado de revisión": ["estado de revision", "status", "review status"],
    "Notas escritor": ["notas escritor", "writer notes"],
    "Notas implementación": ["notas implementacion", "notes", "implementation notes"],
}


def normalize_header(value: str) -> str:
    normalized = value.strip().casefold()
    replacements = {
        "á": "a",
        "é": "e",
        "í": "i",
        "ó": "o",
        "ú": "u",
        "ü": "u",
        "ñ": "n",
    }
    for source, target in replacements.items():
        normalized = normalized.replace(source, target)
    return re.sub(r"[^a-z0-9]+", "", normalized)


def local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def first_child_text(element: ElementTree.Element, child_name: str) -> str:
    for child in element:
        if local_name(child.tag) == child_name:
            return child.text or ""
    return ""


def column_letters_to_index(letters: str) -> int:
    result = 0
    for char in letters:
        result = result * 26 + (ord(char.upper()) - ord("A") + 1)
    return result - 1


def column_index_to_letters(index: int) -> str:
    index += 1
    letters = ""
    while index:
        index, remainder = divmod(index - 1, 26)
        letters = chr(ord("A") + remainder) + letters
    return letters


def escape_xml(value: str) -> str:
    return (
        value.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def issue(severity: str, message: str, row: int | None = None, slot_id: str = "") -> dict:
    return {
        "severity": severity,
        "row": row,
        "slot_id": slot_id,
        "message": message,
    }


def normalize_status(value: str) -> str:
    value = value.strip().upper().replace(" ", "_").replace("-", "_")
    value = value.replace("REVISIÓN", "REVISION")
    return value


def normalize_language(value: str) -> str:
    return value.strip().casefold()


def get_cell_text(cell: ElementTree.Element, shared_strings: list[str]) -> str:
    cell_type = cell.attrib.get("t", "")
    if cell_type == "s":
        index_text = first_child_text(cell, "v").strip()
        if not index_text:
            return ""
        try:
            return shared_strings[int(index_text)]
        except (ValueError, IndexError):
            return ""
    if cell_type == "inlineStr":
        parts = []
        for descendant in cell.iter():
            if local_name(descendant.tag) == "t" and descendant.text:
                parts.append(descendant.text)
        return "".join(parts)
    return first_child_text(cell, "v")


def read_shared_strings(archive: zipfile.ZipFile) -> list[str]:
    if "xl/sharedStrings.xml" not in archive.namelist():
        return []
    root = ElementTree.fromstring(archive.read("xl/sharedStrings.xml"))
    strings = []
    for item in root.iter():
        if local_name(item.tag) != "si":
            continue
        parts = []
        for descendant in item.iter():
            if local_name(descendant.tag) == "t" and descendant.text:
                parts.append(descendant.text)
        strings.append("".join(parts))
    return strings


def normalize_target_path(target: str) -> str:
    target = target.replace("\\", "/")
    if target.startswith("/"):
        target = target.lstrip("/")
    elif not target.startswith("xl/"):
        target = f"xl/{target}"
    target = target.replace("xl/../", "")
    return target


def workbook_sheets(archive: zipfile.ZipFile) -> list[dict]:
    if "xl/workbook.xml" not in archive.namelist():
        return []

    rels = {}
    if "xl/_rels/workbook.xml.rels" in archive.namelist():
        rels_root = ElementTree.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        for rel in rels_root.iter():
            if local_name(rel.tag) == "Relationship":
                rels[rel.attrib.get("Id", "")] = normalize_target_path(
                    rel.attrib.get("Target", "")
                )

    workbook_root = ElementTree.fromstring(archive.read("xl/workbook.xml"))
    sheets = []
    for sheet in workbook_root.iter():
        if local_name(sheet.tag) != "sheet":
            continue
        rel_id = sheet.attrib.get(
            "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id",
            "",
        )
        sheets.append(
            {
                "name": sheet.attrib.get("name", ""),
                "rel_id": rel_id,
                "path": rels.get(rel_id, ""),
            }
        )
    return sheets


def choose_worksheet_path(
    archive: zipfile.ZipFile, sheet_name: str | None
) -> tuple[str, str | None]:
    sheets = workbook_sheets(archive)
    if sheets:
        if sheet_name:
            for sheet in sheets:
                if sheet["name"] == sheet_name:
                    if not sheet["path"]:
                        raise ValueError(f"Sheet '{sheet_name}' has no worksheet path")
                    return sheet["path"], sheet["name"]
            raise ValueError(f"Sheet not found: {sheet_name}")

        first = sheets[0]
        if not first["path"]:
            raise ValueError("First sheet has no worksheet path")
        return first["path"], first["name"]

    worksheet_paths = sorted(
        name
        for name in archive.namelist()
        if name.startswith("xl/worksheets/sheet") and name.endswith(".xml")
    )
    if not worksheet_paths:
        raise ValueError("No worksheet XML found")
    if sheet_name:
        raise ValueError("Sheet name selection requires xl/workbook.xml metadata")
    return worksheet_paths[0], None


def read_xlsx_rows(excel_path: Path, sheet_name: str | None) -> tuple[list[tuple[int, list[str]]], str | None]:
    with zipfile.ZipFile(excel_path) as archive:
        shared_strings = read_shared_strings(archive)
        worksheet_path, selected_sheet = choose_worksheet_path(archive, sheet_name)
        if worksheet_path not in archive.namelist():
            raise ValueError(f"Worksheet not found inside xlsx: {worksheet_path}")
        root = ElementTree.fromstring(archive.read(worksheet_path))
        rows = []
        for row_index, row in enumerate(
            (node for node in root.iter() if local_name(node.tag) == "row"),
            start=1,
        ):
            row_number_text = row.attrib.get("r", "")
            try:
                row_number = int(row_number_text)
            except ValueError:
                row_number = row_index

            values_by_index = {}
            sequential_index = 0
            for cell in row:
                if local_name(cell.tag) != "c":
                    continue
                cell_ref = cell.attrib.get("r", "")
                match = re.match(r"([A-Z]+)", cell_ref)
                if match:
                    column_index = column_letters_to_index(match.group(1))
                else:
                    column_index = sequential_index
                sequential_index = max(sequential_index + 1, column_index + 1)
                values_by_index[column_index] = get_cell_text(cell, shared_strings).strip()

            if values_by_index:
                max_index = max(values_by_index)
                values = [values_by_index.get(index, "") for index in range(max_index + 1)]
            else:
                values = []
            rows.append((row_number, values))
        return rows, selected_sheet


def extract_expected_slots(repo_root: Path) -> tuple[dict[str, set[str]], list[dict]]:
    slots_by_file = {}
    issues = []
    for relative_path in SOURCE_FILES:
        path = repo_root / relative_path
        if not path.exists():
            issues.append(issue("ERROR", f"Missing slot source file: {relative_path}"))
            slots_by_file[relative_path] = set()
            continue
        content = path.read_text(encoding="utf-8")
        slots_by_file[relative_path] = set(SLOT_ID_RE.findall(content))

    all_slots = set().union(*slots_by_file.values()) if slots_by_file else set()
    if not all_slots:
        issues.append(issue("ERROR", "No expected editorial slots were extracted from repo"))
    return slots_by_file, issues


def build_header_map(header_values: list[str]) -> tuple[dict[str, int], list[str]]:
    alias_to_column = {}
    for canonical, aliases in HEADER_ALIASES.items():
        names = [canonical, *aliases]
        for name in names:
            alias_to_column[normalize_header(name)] = canonical

    header_map = {}
    for index, header in enumerate(header_values):
        canonical = alias_to_column.get(normalize_header(header))
        if canonical and canonical not in header_map:
            header_map[canonical] = index

    missing = [column for column in EXPECTED_COLUMNS if column not in header_map]
    return header_map, missing


def value_at(values: list[str], header_map: dict[str, int], column: str) -> str:
    index = header_map.get(column)
    if index is None or index >= len(values):
        return ""
    return values[index].strip()


def validate_rows(
    rows: list[tuple[int, list[str]]],
    expected_slots: set[str],
    selected_sheet: str | None,
    sheet_requested: bool,
) -> tuple[list[dict], dict]:
    findings = []
    non_empty_rows = [(number, values) for number, values in rows if any(values)]
    if not non_empty_rows:
        findings.append(issue("ERROR", "Excel sheet has no readable rows"))
        return findings, {"rows_read": 0, "seen_slots": []}

    header_row_number, header_values = non_empty_rows[0]
    header_map, missing_columns = build_header_map(header_values)
    for column in missing_columns:
        findings.append(
            issue(
                "ERROR",
                f"Missing required column: {column}",
                row=header_row_number,
            )
        )

    if not sheet_requested:
        if selected_sheet:
            findings.append(
                issue(
                    "WARN",
                    f"No sheet specified; first sheet was used: {selected_sheet}",
                    row=header_row_number,
                )
            )
        else:
            findings.append(
                issue("WARN", "No sheet specified; first worksheet XML was used", row=header_row_number)
            )

    seen_keys = {}
    seen_slots = set()
    data_rows = non_empty_rows[1:]

    for row_number, values in data_rows:
        slot_id = value_at(values, header_map, "Slot ID")
        language = normalize_language(value_at(values, header_map, "Idioma"))
        status = normalize_status(value_at(values, header_map, "Estado de revisión"))
        final_text = value_at(values, header_map, "Texto final")
        short_text = value_at(values, header_map, "Alternativa corta")
        implementation_notes = value_at(values, header_map, "Notas implementación")

        if not slot_id:
            findings.append(issue("ERROR", "Empty Slot ID", row=row_number))
        elif slot_id not in expected_slots:
            findings.append(issue("ERROR", f"Unknown Slot ID: {slot_id}", row=row_number, slot_id=slot_id))
        else:
            seen_slots.add(slot_id)

        if language not in ALLOWED_LANGUAGES:
            findings.append(
                issue(
                    "ERROR",
                    f"Language is not allowed: {language or '<empty>'}",
                    row=row_number,
                    slot_id=slot_id,
                )
            )

        if status not in ALLOWED_STATUSES:
            findings.append(
                issue(
                    "ERROR",
                    f"Review status is not allowed: {status or '<empty>'}",
                    row=row_number,
                    slot_id=slot_id,
                )
            )

        key = (slot_id, language)
        if slot_id and language:
            previous_row = seen_keys.get(key)
            if previous_row is not None:
                findings.append(
                    issue(
                        "ERROR",
                        f"Duplicate Slot ID for language {language}; first seen at row {previous_row}",
                        row=row_number,
                        slot_id=slot_id,
                    )
                )
            else:
                seen_keys[key] = row_number

        if status in FINAL_STATUSES and not final_text:
            findings.append(
                issue("ERROR", "Final text is empty in a final state", row=row_number, slot_id=slot_id)
            )

        if "TEMP" in final_text.upper():
            severity = "ERROR" if status in FINAL_STATUSES else "WARN"
            findings.append(
                issue(
                    severity,
                    f"Final text contains TEMP in status {status or '<empty>'}",
                    row=row_number,
                    slot_id=slot_id,
                )
            )

        if not short_text:
            findings.append(issue("WARN", "Short alternative is empty", row=row_number, slot_id=slot_id))

        if not implementation_notes:
            findings.append(
                issue("WARN", "Implementation notes are empty", row=row_number, slot_id=slot_id)
            )

    for missing_slot in sorted(expected_slots - seen_slots):
        findings.append(issue("WARN", f"Expected slot absent from Excel: {missing_slot}", slot_id=missing_slot))

    return findings, {
        "rows_read": len(data_rows),
        "seen_slots": sorted(seen_slots),
    }


def validate_excel(excel_path: Path, repo_root: Path, sheet_name: str | None) -> dict:
    result = {
        "excel": str(excel_path),
        "repo_root": str(repo_root),
        "selected_sheet": None,
        "expected_slots_count": 0,
        "rows_read": 0,
        "errors": 0,
        "warnings": 0,
        "state": "FAIL",
        "findings": [],
    }

    slots_by_file, slot_findings = extract_expected_slots(repo_root)
    expected_slots = set().union(*slots_by_file.values()) if slots_by_file else set()
    result["expected_slots_count"] = len(expected_slots)
    result["slots_by_file"] = {path: sorted(slots) for path, slots in slots_by_file.items()}
    findings = list(slot_findings)

    if not excel_path.exists():
        findings.append(issue("ERROR", f"Excel file does not exist: {excel_path}"))
    elif excel_path.suffix.casefold() != ".xlsx":
        findings.append(issue("ERROR", "Excel file must use .xlsx extension"))
    else:
        try:
            rows, selected_sheet = read_xlsx_rows(excel_path, sheet_name)
            result["selected_sheet"] = selected_sheet
            row_findings, row_stats = validate_rows(
                rows,
                expected_slots,
                selected_sheet,
                sheet_requested=bool(sheet_name),
            )
            findings.extend(row_findings)
            result["rows_read"] = row_stats["rows_read"]
            result["seen_slots_count"] = len(row_stats["seen_slots"])
        except (OSError, ValueError, zipfile.BadZipFile, ElementTree.ParseError) as exc:
            findings.append(issue("ERROR", f"Excel file is unreadable: {exc}"))

    errors = sum(1 for item in findings if item["severity"] == "ERROR")
    warnings = sum(1 for item in findings if item["severity"] == "WARN")
    result["errors"] = errors
    result["warnings"] = warnings
    result["state"] = "FAIL" if errors else "PASS"
    result["findings"] = findings
    return result


def print_console_report(result: dict) -> None:
    print("GVO Editorial Excel Validator")
    print(f"Excel: {result['excel']}")
    print(f"Slots esperados: {result['expected_slots_count']}")
    print(f"Filas leídas: {result['rows_read']}")
    print(f"Errores: {result['errors']}")
    print(f"Advertencias: {result['warnings']}")
    print(f"Estado: {result['state']}")

    findings = result.get("findings", [])
    if findings:
        print()
        print("Hallazgos:")
        for item in findings[:80]:
            row = f"row {item['row']}" if item.get("row") else "row -"
            slot = item.get("slot_id") or "-"
            print(f"[{item['severity']}] {row} slot {slot}: {item['message']}")
        remaining = len(findings) - 80
        if remaining > 0:
            print(f"... {remaining} hallazgos adicionales no impresos en consola.")


def markdown_report(result: dict) -> str:
    lines = [
        "# GVO Editorial Excel Validator",
        "",
        "## Resumen",
        "",
        f"- Excel: `{result['excel']}`",
        f"- Slots esperados: {result['expected_slots_count']}",
        f"- Filas leidas: {result['rows_read']}",
        f"- Errores: {result['errors']}",
        f"- Advertencias: {result['warnings']}",
        f"- Estado: `{result['state']}`",
        "",
        "## Hallazgos",
        "",
        "| Severidad | Fila | Slot ID | Mensaje |",
        "|---|---:|---|---|",
    ]
    for item in result.get("findings", []):
        row = item["row"] if item.get("row") is not None else ""
        slot_id = item.get("slot_id") or ""
        message = item["message"].replace("|", "\\|")
        lines.append(f"| {item['severity']} | {row} | `{slot_id}` | {message} |")
    return "\n".join(lines) + "\n"


def write_reports(result: dict, report_md: Path | None, report_json: Path | None) -> None:
    if report_md:
        report_md.write_text(markdown_report(result), encoding="utf-8")
    if report_json:
        report_json.write_text(
            json.dumps(result, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )


def create_minimal_xlsx(path: Path, rows: list[list[str]]) -> None:
    shared_strings = []
    shared_index = {}

    def shared_string_id(value: str) -> int:
        if value not in shared_index:
            shared_index[value] = len(shared_strings)
            shared_strings.append(value)
        return shared_index[value]

    sheet_rows = []
    for row_index, row in enumerate(rows, start=1):
        cells = []
        for column_index, value in enumerate(row):
            cell_ref = f"{column_index_to_letters(column_index)}{row_index}"
            string_id = shared_string_id(value)
            cells.append(f'<c r="{cell_ref}" t="s"><v>{string_id}</v></c>')
        sheet_rows.append(f'<row r="{row_index}">{"".join(cells)}</row>')

    shared_items = "".join(
        f"<si><t>{escape_xml(value)}</t></si>" for value in shared_strings
    )

    with zipfile.ZipFile(path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        archive.writestr(
            "[Content_Types].xml",
            """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>
</Types>""",
        )
        archive.writestr(
            "_rels/.rels",
            """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>""",
        )
        archive.writestr(
            "xl/workbook.xml",
            """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets><sheet name="Editorial" sheetId="1" r:id="rId1"/></sheets>
</workbook>""",
        )
        archive.writestr(
            "xl/_rels/workbook.xml.rels",
            """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>
</Relationships>""",
        )
        archive.writestr(
            "xl/sharedStrings.xml",
            f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
count="{len(shared_strings)}" uniqueCount="{len(shared_strings)}">{shared_items}</sst>""",
        )
        archive.writestr(
            "xl/worksheets/sheet1.xml",
            f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<sheetData>{''.join(sheet_rows)}</sheetData>
</worksheet>""",
        )


def run_self_test(repo_root: Path) -> int:
    rows = [
        EXPECTED_COLUMNS,
        [
            "Mundo II",
            "1",
            "W2_INTRO_LIA_01",
            "lia",
            "Intencion base",
            "Texto final aprobado",
            "Texto corto",
            "es",
            "FINAL",
            "Nota escritor",
            "Nota implementacion",
        ],
        [
            "Mundo II",
            "2",
            "W2_INTRO_LIA_01",
            "lia",
            "Intencion duplicada",
            "Texto duplicado",
            "Texto corto",
            "es",
            "FINAL",
            "Nota escritor",
            "Nota implementacion",
        ],
        [
            "Mundo II",
            "3",
            "SLOT_DESCONOCIDO_01",
            "lia",
            "Intencion desconocida",
            "Texto desconocido",
            "",
            "es",
            "APROBADO",
            "Nota escritor",
            "",
        ],
    ]
    with tempfile.TemporaryDirectory(prefix="gvo-editorial-validator-") as directory:
        excel_path = Path(directory) / "self_test_editorial.xlsx"
        create_minimal_xlsx(excel_path, rows)
        result = validate_excel(excel_path, repo_root, sheet_name="Editorial")
        print_console_report(result)
        has_duplicate = any("Duplicate Slot ID" in item["message"] for item in result["findings"])
        has_unknown = any("Unknown Slot ID" in item["message"] for item in result["findings"])
        if result["state"] == "FAIL" and has_duplicate and has_unknown:
            print()
            print("Self-test: PASS (expected controlled validation errors were detected)")
            return 0
        print()
        print("Self-test: FAIL (expected validation errors were not detected)")
        return 1


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Validate a GVO editorial .xlsx file without importing it into runtime.",
    )
    parser.add_argument("--excel", help="Path to the local .xlsx file to validate.")
    parser.add_argument("--repo-root", default=".", help="Path to the GVO repository root.")
    parser.add_argument("--sheet", help="Optional sheet name. Defaults to the first sheet.")
    parser.add_argument("--report-md", help="Optional Markdown report path.")
    parser.add_argument("--report-json", help="Optional JSON report path.")
    parser.add_argument(
        "--self-test",
        action="store_true",
        help="Create a temporary .xlsx fixture, validate it, and delete it.",
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or sys.argv[1:])
    repo_root = Path(args.repo_root).resolve()

    if args.self_test:
        return run_self_test(repo_root)

    if not args.excel:
        print("ERROR: --excel is required unless --self-test is used.", file=sys.stderr)
        return 1

    result = validate_excel(Path(args.excel).resolve(), repo_root, args.sheet)
    print_console_report(result)
    write_reports(
        result,
        Path(args.report_md).resolve() if args.report_md else None,
        Path(args.report_json).resolve() if args.report_json else None,
    )
    return 0 if result["state"] == "PASS" else 2


if __name__ == "__main__":
    raise SystemExit(main())
