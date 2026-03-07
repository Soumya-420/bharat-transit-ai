import codecs

with codecs.open('js/i18n.js', 'r', 'utf-8') as f:
    text = f.read()

X = "',\\n"
original_chars = []
i = len(X)
while i < len(text):
    original_chars.append(text[i])
    i += len(X) + 1

recovered_text = ''.join(original_chars)

with codecs.open('js/i18n.js', 'w', 'utf-8') as f:
    f.write(recovered_text)

print('Recovery successful! Original length:', len(recovered_text))
