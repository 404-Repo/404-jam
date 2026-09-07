#!/usr/bin/env python3
"""Build the jam site. Two outputs from one source:
  index.html     media referenced from media/ (the real site, for GitHub Pages or a 404.xyz subdomain)
  artifact.html  every asset inlined as a data URI (for an Artifact preview, whose CSP blocks external media)
"""
import base64, mimetypes, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(HERE, 'body.src.html')).read()
fonts = open(os.path.join(HERE, 'fonts.css')).read()
src = src.replace('/* FONTS_HERE */', fonts)

# The source is a body: the Artifact viewer wraps it in its own doctype and head. GitHub Pages does
# not, and a page with no viewport meta renders the 980px desktop layout on a phone, shrunk to 40
# percent. The mobile CSS below never fired on the public site until this head was added.
HEAD = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="description" content="A two week game jam. Give your agent one line, it builds a Three.js game from the open 404 recipe. Ten TAO in prizes.">
<meta property="og:title" content="404 Game Jam">
<meta property="og:description" content="One line. Two weeks. Ten TAO. Your agent builds the game, every object in it as Three.js code.">
<meta property="og:image" content="https://ben-atlas.github.io/404-jam/media/t_drive_a.jpg">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#F2F2F2">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Crect width='16' height='16' fill='%23000'/%3E%3Crect x='3' y='3' width='10' height='10' fill='%23f85951'/%3E%3C/svg%3E">
"""
page = src.replace('MEDIA/', 'media/')
# the title is the first line of the body source; move it into the head
title = page.split('\n', 1)[0]
assert title.startswith('<title>'), title
page = HEAD + title + '\n</head>\n<body>\n' + page.split('\n', 1)[1] + '\n</body>\n</html>\n'
open(os.path.join(HERE, 'index.html'), 'w').write(page)

def datauri(name):
    p = os.path.join(HERE, 'media', name)
    mime = mimetypes.guess_type(p)[0] or 'application/octet-stream'
    return 'data:%s;base64,%s' % (mime, base64.b64encode(open(p, 'rb').read()).decode())

# the artifact copy carries ONE encode, the smallest: three data URIs would push the page past the
# 16 MB artifact ceiling, and the public site is the one that has to look sharp.
one = src.replace('MEDIA/hero_rust_1280.mp4', 'MEDIA/hero_rust_854.mp4').replace('MEDIA/hero_rust_1600.mp4', 'MEDIA/hero_rust_854.mp4')
inline = re.sub(r'MEDIA/([A-Za-z0-9_.-]+)', lambda m: datauri(m.group(1)), one)
open(os.path.join(HERE, 'artifact.html'), 'w').write(inline)
for f in ('index.html', 'artifact.html'):
    print(f, round(os.path.getsize(os.path.join(HERE, f)) / 1024, 1), 'KB')
