#!/usr/bin/env python3
"""Generate BAOPU logo SVGs (glyphs converted to paths, no font dependency)."""
from fontTools.ttLib import TTFont, TTCollection
from fontTools.pens.svgPathPen import SVGPathPen

SONGTI = '/System/Library/Fonts/Supplemental/Songti.ttc'
GEORGIA = '/System/Library/Fonts/Supplemental/Georgia.ttf'

INK = '#211C17'
GOLD = '#8A6331'
PAPER = '#F7F2E9'

def load(path, index=0):
    if path.endswith('.ttc'):
        return TTCollection(path).fonts[index]
    return TTFont(path)

FONT_CN = load(SONGTI, 1)   # Songti SC Bold
FONT_EN = load(GEORGIA)

def glyph_paths(font, text, size, tracking, x, baseline):
    """Return (svg, advance_width). Outlines stay in font units, scaled by transform."""
    upm = font['head'].unitsPerEm
    s = size / upm
    gs = font.getGlyphSet()
    cmap = font.getBestCmap()
    out = []
    start = x
    for ch in text:
        if ch == ' ':
            x += gs[cmap[ord(' ')]].width * s + tracking
            continue
        gname = cmap[ord(ch)]
        pen = SVGPathPen(gs)
        gs[gname].draw(pen)
        d = pen.getCommands()
        if d:
            out.append('<path d="%s" transform="translate(%.3f %.3f) scale(%.5f -%.5f)"/>'
                       % (d, x, baseline, s, s))
        x += gs[gname].width * s + tracking
    return '\n    '.join(out), (x - tracking) - start

def build(bg=None, ink=INK, gold=GOLD, mark_only=False):
    margin = 26
    cn_size = 110
    cn_track = cn_size * 0.16
    en_size = 15
    en_track = en_size * 0.30
    gap_dot = 15

    cn_base = margin + cn_size * 0.86
    cn_svg, cn_w = glyph_paths(FONT_CN, '宝谱', cn_size, cn_track, margin, cn_base)

    en_base = cn_base + 34
    en1_svg, en1_w = glyph_paths(FONT_EN, 'BAOPU', en_size, en_track, margin, en_base)
    dot_x = margin + en1_w + gap_dot
    dot_svg, dot_w = glyph_paths(FONT_EN, '·', en_size, en_track, dot_x, en_base)
    en2_x = dot_x + dot_w + gap_dot
    en2_svg, en2_w = glyph_paths(FONT_EN, 'A CABINET OF STONES', en_size, en_track, en2_x, en_base)
    en_w = (en2_x + en2_w) - margin

    width = (cn_w if mark_only else max(cn_w, en_w)) + margin * 2
    height = (cn_base + margin) if mark_only else (en_base + margin)

    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %.1f %.1f" width="%.0f" height="%.0f" role="img" aria-label="宝谱 BAOPU · A CABINET OF STONES">' % (width, height, width, height),
           '  <title>宝谱 BAOPU · A CABINET OF STONES</title>']
    if bg:
        out.append('  <rect width="%.1f" height="%.1f" fill="%s"/>' % (width, height, bg))
    out.append('  <g fill="%s">\n    %s\n  </g>' % (ink, cn_svg))
    if not mark_only:
        out.append('  <g fill="%s">\n    %s\n  </g>' % (gold, en1_svg))
        out.append('  <g fill="%s" fill-opacity=".55">\n    %s\n  </g>' % (gold, dot_svg))
        out.append('  <g fill="%s">\n    %s\n  </g>' % (gold, en2_svg))
    out.append('</svg>')
    return '\n'.join(out), width, height

if __name__ == '__main__':
    specs = [
        ('baopu-logo.svg', dict()),
        ('baopu-logo-paper.svg', dict(bg=PAPER)),
        ('baopu-logo-light.svg', dict(ink=PAPER, gold='#D8B98A')),
        ('baopu-logo-mono.svg', dict(ink=INK, gold=INK)),
        ('baopu-mark.svg', dict(mark_only=True)),
    ]
    for name, kw in specs:
        svg, w, h = build(**kw)
        with open(name, 'w', encoding='utf-8') as f:
            f.write(svg)
        print(name, round(w, 1), round(h, 1), len(svg), 'bytes')
