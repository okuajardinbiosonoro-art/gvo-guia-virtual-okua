# 016W repository inventory

## Classification

- `KEEP_RUNTIME`: Station I/II source, tests, public runtime assets, current-used mirrors, and shared gesture component.
- `KEEP_CANONICAL_DOC`: root README, documentation index, current state, Station II contract, asset inventory, cleanup report, deletion manifest, and curated evidence.
- `KEEP_SOURCE_REFERENCE`: existing tracked narrative, Fable handoff, and asset-brief source material.
- `MIGRATE_THEN_DELETE`: 46 untracked 015H-016V-R2 status reports and final visual outputs needed for consolidated documentation.
- `DELETE_OBSOLETE`: superseded untracked visual iterations, local `.claude` configuration, temporary logs, archives, and redundant generated captures.

## Baseline

Preflight was performed on `main` after `git fetch --prune origin`. The remote had no commits absent from local HEAD. Six local commits preceded this finalization work.

The audit found the implementation changes, tests, and assets required by Station II, plus a large untracked QA history. Existing tracked historical documentation was retained; cleanup targeted only demonstrated transient material.
