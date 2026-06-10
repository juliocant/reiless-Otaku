import pathlib

root = pathlib.Path(__file__).resolve().parent
patterns = {
    'Ã¡': 'á', 'Ã©': 'é', 'Ã­': 'í', 'Ã³': 'ó', 'Ãº': 'ú', 'Ã±': 'ñ',
    'Ã': 'Á', 'Ã‰': 'É', 'Ã“': 'Ó', 'Ãš': 'Ú', 'Ã‘': 'Ñ',
    'Ã¼': 'ü', 'Ã ': 'À',
    'Â¿': '¿', 'Â¡': '¡',
    'â†’': '→', 'â†�': '←',
    'â€¹': '‹', 'â€º': '›',
    'â€˜': '‘', 'â€™': '’', 'â€œ': '“', 'â€�': '”',
    'â€¦': '…', 'â€“': '–', 'â€”': '—',
    'ðŸ’¬': '💬', 'ðŸ‘•': '👕', 'ðŸ–¨ï¸': '🖨️', 'ðŸ““': '📓',
    'ðŸ›’': '👉', 'ðŸšš': '🚚', 'âœ¨': '✨',
    'ðŸ’»': '🔓', 'ðŸ˜‰': '😊', 'ðŸ˜¡': '😁',
}

changed_files = []
for path in sorted(root.rglob('*')):
    if path.suffix.lower() not in {'.html', '.js'}:
        continue
    text = path.read_text(encoding='utf-8')
    new_text = text
    for bad, good in patterns.items():
        if bad in new_text:
            new_text = new_text.replace(bad, good)
    if new_text != text:
        path.write_text(new_text, encoding='utf-8')
        changed_files.append(path.relative_to(root))

print('Updated files:')
for p in changed_files:
    print(p)
print('Total', len(changed_files), 'files updated.')
