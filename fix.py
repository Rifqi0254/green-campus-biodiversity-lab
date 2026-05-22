import re
f = open('peta.html', encoding='utf-8').read()
lines = f.split('\n')
out = []
last_id = 1
for l in lines:
    id_m = re.search(r'id:\s*(\d+)', l)
    if id_m:
        last_id = id_m.group(1)
    l = re.sub(r'link: `spesies\.html\?id=\$\{this\.id\}`', f'link: "spesies.html?id={last_id}"', l)
    out.append(l)
open('peta.html', 'w', encoding='utf-8').write('\n'.join(out))
