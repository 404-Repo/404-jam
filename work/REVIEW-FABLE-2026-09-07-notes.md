# Verified by me this session (2026-09-07 evening)

SITE (live, ben-atlas.github.io/404-jam)
- V: public index.html had no doctype/head/viewport; phones rendered 980px layout at 40%. FIXED + pushed 20:5x, live confirmed.
- V: both "sign up and build" CTAs href="#"
- V: 19 span.tbd; footer "draft v4 for review"; countdown to a date marked tbd
- V: TAO never priced; payout "to confirm"
- V: nav tap targets 33x47 / 36x47 / 35x47 (under 44)
- V: entries view fake stats (5 entries / 5 passed / 19 days left), vote localStorage, play/source on example cards -> #entries
- V: favicon 404 (fixed with inline svg)
- V: hero video is Rust 17 rifle POV; 3.7MB phone encode
- V copy contradictions: "no texture pipeline" vs step 2 "images, textures, sky"; "one hard rule" vs six budgets + team + trademark; "same models" vs "any agent, any models"; "0 GPUs" vs FAQ "open model on a rented GPU is an option"
- V: no organiser identity, no contact, no Discord, no X link, no legal entity
- V: no jam rules/submission repo named; "A pull request tbd"
- I: 40% "good to play" cannot be judged from frames for non-shortlisted entries

REPO (public main 1c9fc74 -> ec7f709)
- V: playtest.mjs never reads __GAME__.over; example fails 6/6 because player dies at 23s; gates.md says 5/6 and "wall"
- V: ship.mjs --stamp: second run stamps 0 files, old ?v= stays
- V: HF Tooony133/Qwen-3.6-27B-AronHorn -> 401 anonymously; README says "open weights"
- V: docs/surfaces.md uses absolute /assets/ and /harness/ paths; ship.mjs rejects absolute paths
- V: docs/verify-loop.md says frames-based holds; playtest is metres-based
- V: playtest prints "drops ? busted ?" fields from an older game
- V: example ships no gate of its own; only the stock forward-driving one, which it fails
- V: live.mjs writes live.png to cwd, not gitignored
- V: 18k words of prose; three-round table appears 3x; rig night/interior limits only inside rig.js
- V: the word "jam" appears once in the repo (needs.md), with no link or rules
- I (repo reviewer, plausible): a GLB converted to inline BufferGeometry passes verify.mjs; provenance unenforceable

GAMES (live.mjs, phone viewport, real touch, tonight)
- drive ready 11.6s moved 5.2m; rust17 9.7s 25.1m; lantern 4.1s 27.3m. All pass. Drive is slow to ready vs its own 8s gate claim.

CORRECTION owed to Ben: I relayed "the cheap phone tier beats the desktop tier on the deciding property" at ~20:25. The clean room run withdrew it: the bands were read across three aspect ratios. Blind pair results unaffected.
