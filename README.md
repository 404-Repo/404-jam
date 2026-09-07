# 404 game jam, draft launch site

Public draft: https://ben-atlas.github.io/404-jam/ (entries at `#entries`).
Artifact copy: https://claude.ai/code/artifact/2043ddf6-a5a4-46fa-ae89-66c2d61d8511

## v4, the media-led version

Ben, 2026-09-07: *"i think this is too much text what about this ref https://dream.404.xyz/ you could
generate stills or videos from sample games we've made already"*. So the page now opens on a full
bleed gameplay clip, the copy is roughly half what it was, sections carry one word labels, and every
image is a real capture from a game built with the recipe.

**Brand** is 404.xyz, read from that site's own markup: paper `#F2F2F2`, ink `#000`, coral `#f85951`,
Helvetica set large and tight, `fourzerofourpixel` for labels, `404—GEN` with the em dash.

⚠ **The pixel face is a partial subset** (66 glyphs, taken from `404.xyz/fonts`): uppercase, digits and
a little punctuation. Every pixel string on this page is `text-transform: uppercase` for that reason,
and the face renders those as its own single case forms. Avoid `%`, `+`, the middle dot and arrows in
any pixel string. The subset shipped inside DRIVE's `game/fonts/` is a DIFFERENT, broken subset whose
cmap points at the wrong glyphs; do not use it here.

## Media, and how to make more

`media/` holds one clip and eight stills, 3.4 MB in total:

| file | what | source |
|---|---|---|
| `hero.mp4` | 13 s of Drive in motion, 854x480, HUD hidden | recorded with `tools/clip.mjs` in `~/drive` |
| `hero_poster.jpg` | first frame, for `poster` and reduced motion | same run |
| `t_drive_a/b/c.jpg` | Drive stills | frames from the same run |
| `t_rust_a/b.jpg` | Rust 17 | `~/cod_derrick/rounds/r11`, `r14` |
| `t_costa_a/b.jpg` | Costa Verde | `~/cod_clean/game/_shots` |
| `t_ware.jpg` | warehouse FPS | `404-game-recipe/docs/img/hero.png` |

`tools/clip.mjs` in `~/drive` is the kart gate with a CDP screencast bolted on: it drives the game
with real input and streams JPEG frames at the render rate, then prints the ffmpeg line to stitch
them. `--nohud` injects a style tag that hides every UI element for the whole run.

    node tools/clip.mjs game/ --nohud --out=hero --metres=560 --net=none
    ffmpeg -y -start_number 300 -framerate 71.34 -i game/_karttest/hero_clip/f%05d.jpg \
      -frames:v 950 -vf "scale=854:-2,fps=24" -c:v libx264 -crf 33 -preset veryslow \
      -pix_fmt yuv420p -movflags +faststart hero.mp4

## Build

    python3 build.py

Writes `index.html` (media referenced from `media/`, the real site) and `artifact.html` (everything
inlined as data URIs, for an Artifact preview whose CSP blocks external media). Edit `body.src.html`,
never the two outputs.

## Awaiting Ben

Everything marked `<span class="tbd">`: judges, Atlas signup link and grant size, submission repo,
team size, size and budget numbers, licence wording, Discord, office hours date, how the ten Atlas
licences are chosen, and confirmation of the month on every date.
