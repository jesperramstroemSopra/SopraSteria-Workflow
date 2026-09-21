import re
files = [
 r'C:\Users\jramstroem\AppData\Local\Temp\1789975120258-copilot-tool-output-78946857f69d4a52acc5c24b79b63d0e.txt',
]
for f in files:
    print('=== FILE', f, '===')
    txt = open(f, encoding='utf-8').read()
    titles = re.findall(r'"title":"(.*?)","content"', txt)
    urls = re.findall(r'"contentUrl":"(.*?)"', txt)
    for t in titles:
        print('-', t)
    print('URLS:')
    for u in urls:
        print('-', u)
