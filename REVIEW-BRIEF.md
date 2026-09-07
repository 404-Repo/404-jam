# Pressure test brief: the 404 game jam site and the game recipe

Written 2026-09-07 for a reviewer with no context. Ben asked for this so a fresh model can attack
both pieces of work rather than take them on trust. Everything named here is on disk or on a public
URL, so nothing needs to be believed.

Your job is not to admire any of it. It is to find what is wrong, what is overstated, and what will
embarrass us when it is announced. The strongest claims are the newest, and the newest claims have
had the least scrutiny.

---

## 1. What exists, and where

| thing | where | state |
|---|---|---|
| The jam launch site | https://ben-atlas.github.io/404-jam/ , source `~/404_jam_site` | draft, 19 placeholders marked in coral |
| The public recipe | https://github.com/404-Repo/404-game-recipe | live, updated today |
| Drive, the kart racer | https://404-repo.github.io/drive/game/ , source `~/drive` | shipped, round 6 |
| Rust 17, the shooter | https://404-repo.github.io/rust17/game/ , source `~/cod_derrick` | shipped, round 24 |
| A clean room build | `~/jam_test`, live at https://ben-atlas.github.io/lantern-run/game/ | done, see section 7 |

The jam: two weeks, 11 to 25 September, winners announced at the Bittensor Exploit summit on the
28th. Prizes 5, 3, 1.5 and 0.5 TAO. Entrants sign up to Atlas for credits, use the recipe to make
every object as Three.js code, and submit a game that passes the harness gate.

---

## 2. The claims, in the order they should be attacked

**Claim 1, the load bearing one. "Read GAME.md in github.com/404-Repo/404-game-recipe and build me
a game about anything" produces a good game on its own.** This is the pitch of the site and the
purpose of the repo. It became true, if it is true, only today, when a render rig, a page on what
a reader needs, and a worked case study were added. Attack it directly: read the repo as a stranger
would and say what a competent agent would still get wrong. Better, run the line yourself and judge
what comes out.

**Claim 2. The harness gate makes the jam fair, because every entry is machine checked before a
human sees it.** The gate the repo ships drives forward with the arrow keys. The repo now says
plainly that most games need their own gate and that its own example fails its own gate for that
reason. Is that honesty enough, or is it a hole a jam cannot afford? What stops an entrant writing
a gate that passes their game trivially?

**Claim 3. Judging is blind, in pairs, in motion, and that is fair.** Eight pairs against real
frames of a commercial game and eight against a zero shot build. One judge per round in our own
runs. Is eight pairs enough to separate two entries? What happens when forty entries need ranking
rather than one build needing a direction?

**Claim 4, the rig. `harness/rig.js` gives a reader two colour temperatures, aerial perspective and
a sky that agrees with the light, in two lines.** Measured: shade is 53 to 64 units of blue minus
red cooler than sun across three times of day, and against one directional plus one ambient at
matched exposure it is 55 units cooler where the plain pair is 4 units warmer. Known gaps, all
stated in the file: no ambient occlusion, one solved palette row (golden hour) and four carried
ones, three times the draw calls of the two lights, and no frame rate measured on real hardware.

**Claim 5. Our own numbers.** Drive's blind results were 0, then 1, then 0 of 8 against the bar and
8 of 8 against the floor every round, with the losses going six decisive, then four, then two. I
published 0, 1, 2 earlier today and it was wrong: I had read the critic's guess at which frames
were ours instead of the withheld key. Recount them yourself from `~/drive/work/critic*/verdict.json`
against `bar/KEY.json`. If any other number in the repo or the site is derived the same way, it is
suspect.

---

## 3. What to actually run

```bash
# the repo, as a stranger meets it
git clone https://github.com/404-Repo/404-game-recipe && cd 404-game-recipe && npm install
npm run selftest                          # proves the verifier catches broken assets
node harness/playtest.mjs example/warehouse-fps    # it FAILS: the route does not fit an interior
node harness/pairs.mjs --mine <your frames> --ref <reference frames> --out /tmp/pairs
node harness/ship.mjs example/warehouse-fps
node harness/live.mjs https://404-repo.github.io/drive/game/

# the two shipped games, on a phone viewport
node harness/live.mjs https://404-repo.github.io/rust17/game/

# the site
open https://ben-atlas.github.io/404-jam/ and https://ben-atlas.github.io/404-jam/#entries
```

And read, in this order: `GAME.md`, `docs/gates.md`, `docs/claims.md`, `docs/needs.md`,
`docs/case-drive.md`, `harness/rig.js`'s header comment, then `docs/traps.md`.

---

## 4. Decisions worth challenging

- **All geometry must come through the recipe as code.** It is the one hard rule of the jam and it
  is what makes entries comparable. It also excludes anyone who wants to use a mesh generator,
  which is most of the field. Is one hard rule the right number?
- **The site keeps a floor build and a bar in the method but shows neither.** A visitor sees the
  claim and not the evidence.
- **Votes are per browser, held in local storage, with no bot proofing.** Ben's call for now, and
  the page says so. It is trivially gamed by anyone who opens a private window.
- **The prize is 10 TAO with judges unnamed.** Judges are the single strongest signal a jam has and
  the site has a placeholder there.
- **The banner is Rust 17, a military shooter, on a site whose other pictures are a kart racer and
  a coastal town.** Is that the right first frame for a jam that wants any genre?
- **The site is one page plus an entries view, on a personal GitHub account.** It is meant to move
  to a 404.xyz subdomain before announcement.
- **The repo now recommends a rig.** The repo's position has always been that the architecture is
  the reader's. A rig is opinionated. Where is the line, and did we cross it?

---

## 5. Known weaknesses, so nobody has to find them twice

- The recipe's own example game fails the recipe's own gate, five or six legs of six. It is the
  first command a stranger runs after the selftest and it reads as a broken example. The failure
  message now names the likely cause and points at `docs/gates.md`, and the example is otherwise
  unfixed, because the route that fits a driving game cannot fit an interior shooter.
- The rig has no ambient occlusion, and its night, sunset and noon palettes are carried from a
  golden hour solve rather than measured.
- Nothing in either build has been measured on a real phone. Every frame rate we quote is either
  headless software rendering or a laptop GPU.
- Drive has open bugs listed in `~/drive/NEXT.md`, including a kart that reads magenta in shade.
- The pixel face used on the site is a partial subset: uppercase, digits and a little punctuation.
  Any pixel string with a percent sign, a plus, a middle dot or an arrow silently falls back.
- The jam site has 19 unresolved placeholders, including judges, the Atlas signup link and the
  submission repo.

---

## 6. How to give the feedback

Rank what you find by what would embarrass us most at announcement, not by how easy it is to fix.
For anything you claim is wrong, say how you checked. If you cannot check something, say that
instead of guessing, and name what evidence would settle it.

---

## 7. The clean room run, and what it changes

On 7 September a fresh agent was given an empty folder, the Atlas account an entrant gets, and one
instruction: *Read GAME.md in github.com/404-Repo/404-game-recipe and build me a game about a night
market chase.* It was forbidden from reading anything else on the machine. It fanned out to
thirteen agents, ran three critic rounds, and stopped after four hours.

**What it built.** LANTERN RUN, playable at https://ben-atlas.github.io/lantern-run/game/ , source
in `~/jam_test`. 26 objects generated as Three.js code from 26 Atlas references, 81 candidates
written and 55 thrown away, 13 generated sounds, one music loop, one generated ground material.
3.5 MB, no build step, real touch on a phone. Verified independently with `harness/live.mjs`
against the live URL: ready in 3.2 s, starts from a real touch, moves 31.6 m.

**Its blind results.** 8 of 8 against its own one pass control build, every one decisive. 0 of 8
against real night market photographs, seven decisive and one clear. That is our own shape almost
exactly, from a stranger, on a genre we have never built.

**What it found in the repo, which is why the run was worth its cost.** All four are now fixed:

1. The repo shipped no tool for the blind comparison, the instrument the whole method turns on. It
   wrote its own, the tool was silently broken, and a critic wrote a confident verdict on eight
   identical sheets of broken image icons. It lost a whole round. `harness/pairs.mjs` now ships.
2. `rig.js` at night is a single cool hemisphere: the key fades out across the horizon and the warm
   bounce goes with it, so a night game gets the exact one temperature failure the rig exists to
   prevent, and still paid 1004 draw calls a frame for a shadow pass on a light of intensity zero.
   Now warned, documented and no longer paid for.
3. `rig.js` chains its shader hook, so a game with its own material guard re-wraps every frame until
   nothing draws. Their first assembled build ran the full route and rendered blobs on black.
   Materials now carry a marker so that guard can be written correctly.
4. `playtest.mjs` started the game by calling into it, the anti pattern `docs/gates.md` condemns.

**Its own worst bug is the best argument for the method.** It downscaled three references while the
files were still being written, so three objects were modelled from half a picture. All three passed
the verifier: four sided, correctly sized, based at zero. It was caught by an asset agent looking at
its reference again, which is what 404.md will not stop insisting on.

**What a reviewer should take from it.** The claim in section 2 is now supported for the floor
comparison and unsupported for the bar: one line and this repo produces a real game that decisively
beats what one agent writes cold, and does not approach a photograph. If the jam is sold on the
first of those it is honest. If it is sold on the second it is not.
