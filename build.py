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

open(os.path.join(HERE, 'index.html'), 'w').write(src.replace('MEDIA/', 'media/'))

def datauri(name):
    p = os.path.join(HERE, 'media', name)
    mime = mimetypes.guess_type(p)[0] or 'application/octet-stream'
    return 'data:%s;base64,%s' % (mime, base64.b64encode(open(p, 'rb').read()).decode())

inline = re.sub(r'MEDIA/([A-Za-z0-9_.-]+)', lambda m: datauri(m.group(1)), src)
open(os.path.join(HERE, 'artifact.html'), 'w').write(inline)
for f in ('index.html', 'artifact.html'):
    print(f, round(os.path.getsize(os.path.join(HERE, f)) / 1024, 1), 'KB')
