import os
from pathlib import Path
BAD_PATTERNS = ['Ã','Â','â','�']
GOOD_PATTERNS = 'áéíóúÁÉÍÓÚñÑ¿¡üÜ'
root = Path('.')
encodings = ['utf-8','cp1252','latin_1']
fixed = 0
checked = 0
for p in root.rglob('*.html'):
    checked += 1
    b = p.read_bytes()
    candidates = []
    # basic decodes
    for e in encodings:
        try:
            candidates.append((e, b.decode(e, errors='strict')))
        except Exception:
            candidates.append((e, b.decode(e, errors='replace')))
    # try some round-trip fixes
    try:
        t = b.decode('cp1252', errors='replace')
        candidates.append(('cp1252->utf8', t.encode('utf-8', errors='replace').decode('utf-8', errors='replace')))
    except Exception:
        pass
    try:
        t = b.decode('utf-8', errors='replace')
        candidates.append(('utf8->cp1252->utf8', t.encode('cp1252', errors='replace').decode('utf-8', errors='replace')))
    except Exception:
        pass
    # score candidates
    def score(text):
        bad = sum(text.count(pat) for pat in BAD_PATTERNS)
        good = sum(text.count(ch) for ch in GOOD_PATTERNS)
        return good - bad*2
    scored = [(score(t), enc, t) for enc,t in candidates]
    scored.sort(reverse=True, key=lambda x: x[0])
    best_score, best_enc, best_text = scored[0]
    # current file read as utf-8 for baseline
    try:
        current = b.decode('utf-8', errors='replace')
    except:
        current = b.decode('cp1252', errors='replace')
    current_score = score(current)
    if best_score > current_score:
        # write best_text as utf-8 without BOM
        p.write_text(best_text, encoding='utf-8')
        fixed += 1
        print(f"Fixed: {p} (from score {current_score} to {best_score})")
print(f"Checked: {checked}, Fixed: {fixed}")
