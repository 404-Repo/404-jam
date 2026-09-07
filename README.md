# 404 game jam, draft launch site

Draft for Ben's review, 2026-09-07. Artifact: https://claude.ai/code/artifact/2043ddf6-a5a4-46fa-ae89-66c2d61d8511

- `index.html` is the published page (fonts inlined as data URIs).
- `body.src.html` is the source with `/* FONTS_HERE */` where the @font-face block goes.
- `fonts.css` is that block: Latin subsets of Pilat Extended Black, Helvetica Now Display XBold and
  fourzerofourpixel, licensed to 404 GEN, copied from the DRIVE game's `game/fonts/`. The pixel face
  has no `! " # % & ' + ; < = > [ ] _` in the subset, so keep pixel-face strings to letters, digits,
  full stops, commas, colons, hyphens, slashes and the em dash.

Rebuild after editing the source:

    python3 -c "b=open('body.src.html').read();f=open('fonts.css').read();open('index.html','w').write(b.replace('/* FONTS_HERE */',f))"

Everything awaiting Ben is marked `<span class="tbd">`: prizes, dates, judges, Atlas signup link and
credit grant, submission repo, team size, licence wording, Discord link, entry cap, budgets.
