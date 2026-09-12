# LIA-M4-FINAL-01 — Presence and identity correction

PROGRAM_RUN_ID: OKUA-LIA-M4-20260911T220122889Z-828C3DE3.
Existing branch milestone/lia-experience-knowledge-foundation-v0.4; GVO PR #2 and Intelligence PR #5. Prior M4 closed Draft because presence scored 6/10. This explicitly authorized ticket continues those same PRs; final human scorecard and merge remain pending.

Only GREETING-A, LISTENING-A and EXPLAINING-A are promoted from the exact human-approved originals. The originals are under assets-source/lia-m4, outside public/precache. Recipe tools/assets/derive_lia_m4_assets.mjs emits lossless WebP without crop, scaling, redraw or generation. Alpha and every nontransparent RGB pixel match the originals. Runtime and current-used copies are byte-identical. The manifest records source/runtime hashes, encoder versions and recipe.

State routing is explicit in src/features/lia-preview/presence.ts: entry/greeting -> greeting; input focus/listening/typing -> listening; answering/explaining/sources -> explaining. Idle/thinking/clarifying/uncertain/refusal/unavailable/farewell and the standalone reduced_motion fallback use the prior canonical idle sprite's first frame. Reduced-motion preference disables float, arrival and background parallax, while active greeting/listening/explaining still switch artwork: it is a motion preference, not an anatomical change or a replacement of the current interaction state.

Automatic focus on entry and after a reply does not switch artwork to listening; an explicit pointer/focus/typing action does. Desktop presence is sticky beside the reading panel, with a static environmental halo/pedestal and a brief pose transition. On portrait, presence and title precede the question. Sources, SAFE_EXTRACTIVE contract, privacy bounds, guards and five stations remain unchanged. The review/target panel needs explicit DEV configuration; the normal demo and normal production builds hide it even when the preview feature is enabled.

Farewell-A, Thinking-A/B and Uncertain-A remain outside runtime; guard cases reject all four IDs and hashes anywhere in the runtime manifest. The earlier CANDIDATE_MANIFEST is a historical lab inventory, not runtime authorization. Asset approval is not final screen acceptance. Remaining P1 debts: unapproved pose retouch and knowledge authority expansion. No automatic M5, models, field access or deployment.

Validation commands: node tools/qa/lia_m4_guards.mjs --production; unit presence/UI tests; legacy, M3/M4 and normal-mode presence browser suites; PWA and clean clone checks. See the correction run receipts for actual results and the final human evaluation; never infer a score from tests.
