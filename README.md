# 404 game jam, draft launch site

Draft for Ben's review. Public: https://ben-atlas.github.io/404-jam/ (entries page at `#entries`).
Artifact: https://claude.ai/code/artifact/2043ddf6-a5a4-46fa-ae89-66c2d61d8511

## Brand

v3 is built on the **404.xyz** system, read from that site's own markup, because the jam will live on a
404.xyz subdomain: paper `#F2F2F2`, ink `#000`, coral `#f85951`, Helvetica for headlines set very large and
tight, and `fourzerofourpixel` for every label, nav item and number. Wordmark is `404—GEN` with the em dash.
Their nav is terse and lowercase (`exp-001`, `catalog`, `app`), so ours is `enter rules gate judging prizes
entries` and the jam is tagged `jam-001`.

Catchiness, taken from chromaawards.com: a scale line as the hero (`One line. Two weeks. Ten TAO.`), a stat
strip under it, a moving ticker, a live countdown, and the prompt line itself as the thing you copy.

## Files

- `index.html` is the published page (pixel font and the reference thumbnail inlined).
- `body.src.html` is the source, with `/* FONTS_HERE */` and `THUMB_B64` as the two injection points.
- `fonts.css` is the `@font-face` block for `fourzerofourpixel` (licensed to 404 GEN).
- `thumb.b64` is a frame of DRIVE, used on the reference entry card.

Rebuild after editing the source:

    python3 -c "b=open('body.src.html').read();f=open('fonts.css').read();t=open('thumb.b64').read().strip();open('index.html','w').write(b.replace('/* FONTS_HERE */',f).replace('THUMB_B64',t))"

The pixel face subset has no `! " # % & ' + ; < = > [ ] _`, so keep pixel-face strings to letters, digits,
full stops, commas, colons, hyphens, slashes, parentheses and the em dash.

## Awaiting Ben

Everything marked `<span class="tbd">`: judges, Atlas signup link and grant size, submission repo, team size,
entry cap, size and budget numbers, licence wording, Discord, office hours date, how the ten Atlas licences
are chosen, and confirmation of the month on every date.
