#!/usr/bin/env python3
"""Build and validate FINAL-LIA-IDLE-001 from an approved 3x2 source sheet.

This utility is production tooling, not runtime code. It never edits its source
sheet and it does not promote outputs into public/assets or current-used.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import tempfile
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Sequence

from PIL import Image, ImageDraw


FINAL_SIZE = (1536, 256)
FRAME_SIZE = (256, 256)
FRAME_COUNT = 6
SAFE_AREA_PX = 16
MAX_CENTER_DRIFT_PX = 6.0
MAX_BASELINE_DRIFT_PX = 4
MAX_SCALE_DELTA_PERCENT = 2.0
MIN_VISIBLE_WIDTH_PERCENT = 46.0
MAX_VISIBLE_WIDTH_PERCENT = 54.0
MIN_VISIBLE_HEIGHT_PERCENT = 58.0
MAX_VISIBLE_HEIGHT_PERCENT = 64.0

FINAL_NAME = "final_lia_idle_contemplative_6f_v01.webp"
PREVIEW_PNG_NAME = "final_lia_idle_contemplative_6f_preview.png"
PREVIEW_ANIMATED_NAME = "final_lia_idle_contemplative_6f_preview_animated.webp"
METRICS_NAME = "final_lia_idle_contemplative_6f_metrics.json"


class ValidationError(RuntimeError):
    """Raised when the input or assembled strip violates the contract."""


@dataclass(frozen=True)
class FrameMetrics:
    frame: int
    bbox: list[int]
    visible_width: int
    visible_height: int
    visible_width_percent: float
    visible_height_percent: float
    center_x: float
    center_y: float
    center_drift_x_from_f1: float
    center_drift_y_from_f1: float
    center_drift_from_f1: float
    baseline: int
    baseline_drift_from_f1: int
    scale_width_delta_percent_from_f1: float
    scale_height_delta_percent_from_f1: float
    margins: dict[str, int]
    edge_contacts: list[str]
    safe_area_pass: bool
    bbox_range_pass: bool


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest().upper()


def parse_sheet(path: Path) -> tuple[Image.Image, int]:
    if not path.is_file():
        raise ValidationError(f"Sheet not found: {path}")
    with Image.open(path) as opened:
        if "A" not in opened.mode and "transparency" not in opened.info:
            raise ValidationError(f"Sheet must have an alpha channel; mode={opened.mode}")
        sheet = opened.convert("RGBA")
    width, height = sheet.size
    if width % 3 or height % 2:
        raise ValidationError(f"Sheet dimensions must divide exactly into 3x2 cells; got {width}x{height}")
    cell_width, cell_height = width // 3, height // 2
    if cell_width != cell_height:
        raise ValidationError(
            f"Sheet must contain six square cells in a 3x2 layout; got cells {cell_width}x{cell_height}"
        )
    return sheet, cell_width


def split_row_major(sheet: Image.Image, cell_size: int) -> list[Image.Image]:
    frames: list[Image.Image] = []
    for row in range(2):
        for column in range(3):
            left, top = column * cell_size, row * cell_size
            frames.append(sheet.crop((left, top, left + cell_size, top + cell_size)))
    if len(frames) != FRAME_COUNT:
        raise ValidationError(f"Frame count must be {FRAME_COUNT}; got {len(frames)}")
    return frames


def resize_once(frames: Sequence[Image.Image], interpolation: str) -> list[Image.Image]:
    filters = {"nearest": Image.Resampling.NEAREST, "lanczos": Image.Resampling.LANCZOS}
    resample = filters[interpolation]
    return [frame.resize(FRAME_SIZE, resample=resample) if frame.size != FRAME_SIZE else frame.copy() for frame in frames]


def alpha_center(alpha: Image.Image) -> tuple[float, float]:
    x_projection = [sum(alpha.crop((x, 0, x + 1, alpha.height)).getdata()) for x in range(alpha.width)]
    y_projection = [sum(alpha.crop((0, y, alpha.width, y + 1)).getdata()) for y in range(alpha.height)]
    total = sum(x_projection)
    if not total:
        raise ValidationError("Frame has no visible alpha content")
    return (
        sum(index * value for index, value in enumerate(x_projection)) / total,
        sum(index * value for index, value in enumerate(y_projection)) / total,
    )


def base_measurements(frames: Sequence[Image.Image]) -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    for index, frame in enumerate(frames, 1):
        alpha = frame.getchannel("A")
        bbox = alpha.getbbox()
        if bbox is None:
            raise ValidationError(f"F{index} has no visible alpha content")
        x0, y0, x1, y1 = bbox
        center_x, center_y = alpha_center(alpha)
        margins = {"left": x0, "top": y0, "right": FRAME_SIZE[0] - x1, "bottom": FRAME_SIZE[1] - y1}
        rows.append(
            {
                "frame": index,
                "bbox": [x0, y0, x1, y1],
                "visible_width": x1 - x0,
                "visible_height": y1 - y0,
                "center_x": center_x,
                "center_y": center_y,
                "baseline": y1 - 1,
                "margins": margins,
                "edge_contacts": [name for name, value in margins.items() if value == 0],
            }
        )
    return rows


def validate_frames(frames: Sequence[Image.Image]) -> list[FrameMetrics]:
    if len(frames) != FRAME_COUNT:
        raise ValidationError(f"Frame count must be {FRAME_COUNT}; got {len(frames)}")
    measured = base_measurements(frames)
    first = measured[0]
    metrics: list[FrameMetrics] = []
    failures: list[str] = []
    for row in measured:
        width_percent = float(row["visible_width"]) / FRAME_SIZE[0] * 100.0
        height_percent = float(row["visible_height"]) / FRAME_SIZE[1] * 100.0
        dx = float(row["center_x"]) - float(first["center_x"])
        dy = float(row["center_y"]) - float(first["center_y"])
        center_drift = math.hypot(dx, dy)
        baseline_drift = int(row["baseline"]) - int(first["baseline"])
        width_delta = abs(float(row["visible_width"]) / float(first["visible_width"]) - 1.0) * 100.0
        height_delta = abs(float(row["visible_height"]) / float(first["visible_height"]) - 1.0) * 100.0
        safe = min(row["margins"].values()) >= SAFE_AREA_PX
        bbox_range = (
            MIN_VISIBLE_WIDTH_PERCENT <= width_percent <= MAX_VISIBLE_WIDTH_PERCENT
            and MIN_VISIBLE_HEIGHT_PERCENT <= height_percent <= MAX_VISIBLE_HEIGHT_PERCENT
        )
        frame_id = int(row["frame"])
        if row["edge_contacts"]:
            failures.append(f"F{frame_id} visible alpha touches: {','.join(row['edge_contacts'])}")
        if not safe:
            failures.append(f"F{frame_id} safe area below {SAFE_AREA_PX}px: {row['margins']}")
        if not bbox_range:
            failures.append(
                f"F{frame_id} bbox outside visible-size range: width={width_percent:.2f}% height={height_percent:.2f}%"
            )
        if center_drift > MAX_CENTER_DRIFT_PX:
            failures.append(f"F{frame_id} center drift {center_drift:.2f}px > {MAX_CENTER_DRIFT_PX:.2f}px")
        if abs(baseline_drift) > MAX_BASELINE_DRIFT_PX:
            failures.append(f"F{frame_id} baseline drift {baseline_drift}px > {MAX_BASELINE_DRIFT_PX}px")
        if width_delta > MAX_SCALE_DELTA_PERCENT or height_delta > MAX_SCALE_DELTA_PERCENT:
            failures.append(
                f"F{frame_id} scale delta width={width_delta:.2f}% height={height_delta:.2f}% > {MAX_SCALE_DELTA_PERCENT:.2f}%"
            )
        metrics.append(
            FrameMetrics(
                frame=frame_id,
                bbox=list(row["bbox"]),
                visible_width=int(row["visible_width"]),
                visible_height=int(row["visible_height"]),
                visible_width_percent=round(width_percent, 3),
                visible_height_percent=round(height_percent, 3),
                center_x=round(float(row["center_x"]), 3),
                center_y=round(float(row["center_y"]), 3),
                center_drift_x_from_f1=round(dx, 3),
                center_drift_y_from_f1=round(dy, 3),
                center_drift_from_f1=round(center_drift, 3),
                baseline=int(row["baseline"]),
                baseline_drift_from_f1=baseline_drift,
                scale_width_delta_percent_from_f1=round(width_delta, 3),
                scale_height_delta_percent_from_f1=round(height_delta, 3),
                margins=dict(row["margins"]),
                edge_contacts=list(row["edge_contacts"]),
                safe_area_pass=safe,
                bbox_range_pass=bbox_range,
            )
        )
    if failures:
        raise ValidationError("Frame validation failed:\n- " + "\n- ".join(failures))
    return metrics


def alpha_iou(first: Image.Image, last: Image.Image) -> float:
    a = first.getchannel("A")
    b = last.getchannel("A")
    intersection = 0
    union = 0
    for av, bv in zip(a.getdata(), b.getdata()):
        if av or bv:
            union += 1
            if av and bv:
                intersection += 1
    return intersection / union if union else 1.0


def mean_rgba_delta(first: Image.Image, last: Image.Image) -> float:
    total = 0
    samples = FRAME_SIZE[0] * FRAME_SIZE[1] * 4
    for a, b in zip(first.getdata(), last.getdata()):
        total += sum(abs(left - right) for left, right in zip(a, b))
    return total / samples


def ensure_output_targets(output_dir: Path, force: bool) -> dict[str, Path]:
    output_dir.mkdir(parents=True, exist_ok=True)
    targets = {
        "final_webp": output_dir / FINAL_NAME,
        "preview_png": output_dir / PREVIEW_PNG_NAME,
        "preview_animated_webp": output_dir / PREVIEW_ANIMATED_NAME,
        "metrics_json": output_dir / METRICS_NAME,
    }
    existing = [str(path) for path in targets.values() if path.exists()]
    if existing and not force:
        raise ValidationError("Output target(s) already exist; use --force only after verifying the directory:\n- " + "\n- ".join(existing))
    if any(path.is_symlink() for path in targets.values() if path.exists()):
        raise ValidationError("Refusing to overwrite a symlink output")
    return targets


def build(sheet_path: Path, output_dir: Path, interpolation: str, duration_ms: int, force: bool = False) -> dict[str, object]:
    source_hash_before = sha256(sheet_path)
    sheet, source_cell_size = parse_sheet(sheet_path)
    source_frames = split_row_major(sheet, source_cell_size)
    frames = resize_once(source_frames, interpolation)
    frame_metrics = validate_frames(frames)
    targets = ensure_output_targets(output_dir, force)

    strip = Image.new("RGBA", FINAL_SIZE, (0, 0, 0, 0))
    for index, frame in enumerate(frames):
        strip.alpha_composite(frame, (index * FRAME_SIZE[0], 0))
    strip.save(targets["final_webp"], "WEBP", lossless=True, quality=100, method=6, exact=True)
    strip.save(targets["preview_png"], "PNG", optimize=True)
    per_frame_duration = max(1, round(duration_ms / FRAME_COUNT))
    frames[0].save(
        targets["preview_animated_webp"],
        "WEBP",
        save_all=True,
        append_images=list(frames[1:]),
        duration=per_frame_duration,
        loop=0,
        lossless=True,
        quality=100,
        method=6,
        exact=True,
    )
    source_hash_after = sha256(sheet_path)
    if source_hash_after != source_hash_before:
        raise ValidationError("Source sheet changed during assembly")
    with Image.open(targets["final_webp"]) as assembled:
        if assembled.size != FINAL_SIZE or assembled.mode != "RGBA":
            raise ValidationError(f"Export verification failed: size={assembled.size}, mode={assembled.mode}")
    report: dict[str, object] = {
        "contract": "FINAL-LIA-IDLE-001_ASSEMBLY_CONTRACT",
        "classification": "PRODUCTION_OUTPUT_PENDING_HUMAN_REVIEW / NOT_RUNTIME",
        "source": {
            "path": str(sheet_path.resolve()),
            "sha256_before": source_hash_before,
            "sha256_after": source_hash_after,
            "canvas": list(sheet.size),
            "layout": "3x2 row-major",
            "source_cell_size": [source_cell_size, source_cell_size],
        },
        "assembly": {
            "interpolation": interpolation,
            "single_resize_per_cell": True,
            "final_canvas": list(FINAL_SIZE),
            "grid": "6x1",
            "cell_size": list(FRAME_SIZE),
            "frame_count": FRAME_COUNT,
            "duration_ms": duration_ms,
            "preview_frame_duration_ms": per_frame_duration,
            "blink_method": "OPTION_A_SHEET_STATES",
        },
        "limits": {
            "safe_area_px": SAFE_AREA_PX,
            "center_drift_px": MAX_CENTER_DRIFT_PX,
            "baseline_drift_px": MAX_BASELINE_DRIFT_PX,
            "scale_delta_percent": MAX_SCALE_DELTA_PERCENT,
            "visible_width_percent": [MIN_VISIBLE_WIDTH_PERCENT, MAX_VISIBLE_WIDTH_PERCENT],
            "visible_height_percent": [MIN_VISIBLE_HEIGHT_PERCENT, MAX_VISIBLE_HEIGHT_PERCENT],
        },
        "frames": [asdict(item) for item in frame_metrics],
        "loop_closure": {
            "f6_to_f1_alpha_iou": round(alpha_iou(frames[0], frames[5]), 6),
            "f6_to_f1_mean_rgba_delta": round(mean_rgba_delta(frames[0], frames[5]), 6),
        },
        "outputs": {},
        "validation": "PASS",
        "runtime_promoted": False,
    }
    targets["metrics_json"].write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    report["outputs"] = {
        key: {"path": str(path.resolve()), "bytes": path.stat().st_size, "sha256": sha256(path)}
        for key, path in targets.items()
        if key != "metrics_json"
    }
    targets["metrics_json"].write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    report["outputs"]["metrics_json"] = {
        "path": str(targets["metrics_json"].resolve()),
        "bytes": targets["metrics_json"].stat().st_size,
        "sha256": sha256(targets["metrics_json"]),
    }
    return report


def synthetic_sheet(path: Path, invalid: bool = False) -> None:
    cell = 384
    sheet = Image.new("RGBA", (cell * 3, cell * 2), (0, 0, 0, 0))
    shifts = [0, -3, -6, -3, 3, 0]
    for index, shift in enumerate(shifts):
        frame = Image.new("RGBA", (cell, cell), (0, 0, 0, 0))
        draw = ImageDraw.Draw(frame)
        x0, x1 = 96, 287
        y0, y1 = 75 + shift, 310 + shift
        if invalid and index == 0:
            y0 = 0
        draw.ellipse((x0, y0, x1, y1), fill=(210, 225, 220, 255))
        draw.rectangle((158, y0 + 68, 225, y1 - 35), fill=(226, 182, 88, 255))
        draw.ellipse((170, y0 + 52, 187, y0 + 62), fill=(120, 82, 158, 255))
        draw.ellipse((196, y0 + 52, 213, y0 + 62), fill=(120, 82, 158, 255))
        column, row = index % 3, index // 3
        sheet.alpha_composite(frame, (column * cell, row * cell))
    sheet.save(path, "PNG")


def self_test() -> dict[str, object]:
    with tempfile.TemporaryDirectory(prefix="gvo_021g_r1_lia_idle_") as temp:
        root = Path(temp)
        valid_sheet = root / "synthetic_valid_3x2.png"
        invalid_sheet = root / "synthetic_invalid_3x2.png"
        synthetic_sheet(valid_sheet)
        synthetic_sheet(invalid_sheet, invalid=True)
        report = build(valid_sheet, root / "out-nearest", "nearest", 4000)
        lanczos_report = build(valid_sheet, root / "out-lanczos", "lanczos", 4000)
        with Image.open(root / "out-nearest" / FINAL_NAME) as final_image:
            if final_image.size != FINAL_SIZE:
                raise AssertionError(final_image.size)
        required = {FINAL_NAME, PREVIEW_PNG_NAME, PREVIEW_ANIMATED_NAME, METRICS_NAME}
        if {path.name for path in (root / "out-nearest").iterdir()} != required:
            raise AssertionError("Self-test output set mismatch")
        if {path.name for path in (root / "out-lanczos").iterdir()} != required:
            raise AssertionError("Lanczos self-test output set mismatch")
        invalid_rejected = False
        try:
            build(invalid_sheet, root / "out-invalid", "lanczos", 4000)
        except ValidationError:
            invalid_rejected = True
        if not invalid_rejected:
            raise AssertionError("Unsafe synthetic sheet was not rejected")
        return {
            "status": "PASS",
            "valid_sheet": "PASS",
            "nearest": "PASS",
            "lanczos": "PASS",
            "unsafe_sheet_rejected": True,
            "final_canvas": report["assembly"]["final_canvas"],
            "frame_count": report["assembly"]["frame_count"],
            "outputs_verified_per_interpolation": sorted(required),
            "lanczos_final_canvas": lanczos_report["assembly"]["final_canvas"],
            "temporary_artifacts_retained": False,
        }


def parser() -> argparse.ArgumentParser:
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("--sheet", type=Path, help="Approved PNG RGBA sheet in 3x2 row-major layout")
    cli.add_argument("--output-dir", type=Path, help="Non-runtime output directory")
    cli.add_argument("--interpolation", choices=("nearest", "lanczos"), default="nearest")
    cli.add_argument("--duration-ms", type=int, default=4000, help="Documentary preview loop duration")
    cli.add_argument("--force", action="store_true", help="Overwrite only the four exact output filenames")
    cli.add_argument("--self-test", action="store_true", help="Run valid/invalid synthetic fixture checks in a temp directory")
    return cli


def main() -> int:
    args = parser().parse_args()
    try:
        if args.self_test:
            print(json.dumps(self_test(), indent=2))
            return 0
        if args.sheet is None or args.output_dir is None:
            raise ValidationError("--sheet and --output-dir are required unless --self-test is used")
        if args.duration_ms <= 0:
            raise ValidationError("--duration-ms must be positive")
        report = build(args.sheet, args.output_dir, args.interpolation, args.duration_ms, args.force)
        print(json.dumps(report, indent=2))
        return 0
    except (ValidationError, OSError) as error:
        print(f"ERROR: {error}")
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
