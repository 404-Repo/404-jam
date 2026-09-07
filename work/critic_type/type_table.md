# 404 jam site, type inventory (measured from the built index.html via computed styles)

## Pixel face (fourzerofourpixel). Design module = 0.1em, cap height 0.5em, chamfer 0.025em.
Only font sizes that are a whole multiple of 10px put the module on a whole CSS pixel.

| role | selector | px | tracking | line-height |
|---|---|---|---|---|
| TBD marker | .tbd::after | 8 | INHERITED (-0.13em in a date, 0 in a step, +0.11em in the tagline) | 1.45 |
| gallery caption | .shotcell .cap | 9 | .06em | 1.45 |
| card found label | .found b | 9 | .07em | 1.4 |
| badge | .badge | 9 | .05em | 1.45 |
| card tag | .tag | 9 | .06em | 1.45 |
| video toggle | .play | 10 | .06em | normal |
| prompt label | .promptwrap .lbl | 10 | .09em | 1.45 |
| panel buttons | .panel button | 10 | .06em | normal |
| stat label | .stat span | 10 | .07em | 1.45 |
| step number | .step .n | 10 | NONE (0) | 1.45 |
| spec key | .spec .k | 10 | .07em | 1.45 |
| filter label | .filters .lbl | 10 | .07em | 1.45 |
| chip | .chip | 10 | .05em | normal |
| card byline | .by | 10 | .05em | 1.45 |
| card actions | .cact a | 10 | .07em | 1.45 |
| bar nav | .bar a | 11 | .05em | 1.45 |
| hero tagline | .stage .tagline | 11 | .08em | 1.45 |
| section label | .lab | 11 | .10em | 1.45 |
| base pixel | .pix (prize, tcell, footer, judging) | 11 | .06em | 1.45 |
| empty state | .empty | 11 | .07em | 1.45 |
| faq marker | .faq summary::before | 11 | -0.029em (inherited from summary) | 1.45 |
| buttons | .btn | 12 | .06em | 1.45 |
| wordmark, bar | .bar .mark | 13 | .05em | 1.45 |
| wordmark, footer | footer .mark | 11 | .06em | 1.45 |

Sizes in use: 8, 9, 10, 11, 12, 13. Trackings in use: 0, .05, .06, .07, .08, .09, .10 em.
Measured antialias share (1x, share of ink pixels that are intermediate grey):
8px 89.0% | 9px 84.9% | 10px 75.4% | 11px 83.9% | 12px 70.6% | 13px 69.8% | 15px 62.9% | 20px 45.7%

## Sans (Helvetica)

| role | selector | px | weight | line-height | tracking |
|---|---|---|---|---|---|
| hero h1 | h1 | clamp(44,10.5vw,140) | 700 | .84 | -.055em |
| entries h1 | #view-entries h1 | clamp(40,8vw,96) | 700 | .84 | -.055em |
| prize amount | .prize .amt | clamp(34,5vw,58) | 700 | 1 | -.055em |
| stat number | .stat b | clamp(30,4vw,46) | 700 | 1 | -.05em |
| section h2 | h2 | clamp(26,4vw,44) | 700 | .98 | -.045em |
| date number | .tcell .d | 26 fixed | 700 | 1.45 | -.04em |
| card title | .cbody h3 | 19 | 700 | 1 | -.035em |
| lead | p.lead | 18 | 700 | 1.30 | -.02em |
| body | body, p.g | 16 | 400 | 1.45 | 0 |
| faq question | .faq summary | 16 | 700 | 1.45 | -.02em |
| spec value | .spec .v | 15 | 400 | 1.45 | 0 |
| hero paragraph | .stage .row p | 15 | 400 | 1.45 | 0 |
| step heading | .step h3 | 15 | 700 | 1.45 | -.015em |
| faq answer | .faq p | 14.5 | 400 | 1.45 | 0 |
| card body | .found | 13.5 | 400 | 1.40 | 0 |
| cell copy | .step p, .prize p, .tcell p | 13 | 400 | 1.45 | 0 |
| stat suffix | .stat b em | .4em (18.4 at 1440) | 700 | 1 | -.01em |
| prize suffix | .prize .amt em | .34em (19.72 at 1440) | 700 | 1 | INHERITED -.1618em |

Sans sizes in use: 13, 13.5, 14.5, 15, 16, 18, 19, 26 + 4 clamps. Seven of them inside a 6px band.

## Mono
| role | px |
|---|---|
| prompt code | clamp(14,1.7vw,20) |
| spec value code | 13 |
| step code | 12 |

## Measures (characters per line at 1440)
#what p.g 72.3 | #gate p.g 62.7 | #judging p.g 65.3 | p.lead 67.0 | .faq p 49.5 | hero p 29.7
