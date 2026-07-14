# Deletion manifest

## Station III closeout — 017K

- `src/screens/World3Root/PixelLia.tsx`: removed as dead provisional code after proving zero consumers and replacement by `World3LiaActor` plus approved runtime poses.
- `docs/status/GVO_STATION3_FABLE_BASE_PORT.md`: removed as a superseded intermediate report whose claims about assets and approval no longer matched the repository; canonical history moved to `docs/status/GVO_STATION3_COMPLETE.md`.

No Station III runtime asset was deleted. The 15 runtime/current-used pairs are required policy mirrors and remain byte-identical. No QA ZIP, local log, build output, cache, or Downloads artifact was added to Git.

## Migrated then removed

- Untracked `docs/status/015H*` through `016V*`: consolidated into current state, Station II contract, changelog, and maintenance records.
- Untracked `docs/visual/world2/` iterations except `final/`: final 016V-R2 runner and representative proof migrated to the curated directory.
- Untracked responsive, World I, and gesture-hint iteration sets: latest representative proof retained in their respective final directories.

## Removed as obsolete

- `.claude/`: machine-local assistant configuration; now ignored.
- Root temporary Vite logs: generated local output already covered by `*.log` ignore.
- ZIP or packaged QA evidence: redundant with directly inspectable curated files.

All removals were limited to untracked transient artifacts. Runtime and source-reference assets were preserved.
