import re,cairosvg
from PIL import Image
s=open('omarchy-logo-source.svg').read()
P=[re.search(r' d="([^"]*)"',p).group(1) for p in re.findall(r'<path[^>]*>',s)]
O,Y,C=P[1],P[6],P[4]
def g(d,dx,fill): return f'<path fill-rule="evenodd" clip-rule="evenodd" transform="translate({dx} 0)" fill="{fill}" d="{d}"/>'
def svg(bg,ink,cfill,under=None):
  extra=f'<rect x="0" y="285" width="465" height="15" fill="{under}"/>' if under else ''
  return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-90 -75 645 450" width="1290" height="900"><rect x="-90" y="-75" width="645" height="450" fill="{bg}"/>{g(O,0,ink)}{g(Y,165-1080,ink)}{g(C,330-750,cfill)}{extra}</svg>'
V={'oyc-logo-1-bone-on-charcoal':svg('#1a1b1e','#ece6d9','#ece6d9'),
   'oyc-logo-2-green-accent':svg('#1a1b1e','#ece6d9','#ece6d9',under='#9ece6a'),
   'oyc-logo-3-dark-on-light':svg('#ece6d9','#1a1b1e','#1a1b1e')}
for n,x in V.items():
  open(n+'.svg','w').write(x); cairosvg.svg2png(bytestring=x.encode(),write_to=n+'.png')
ims=[Image.open(n+'.png') for n in V]; sh=Image.new('RGB',(1290*3+80,980),'#888')
for i,im in enumerate(ims): sh.paste(im,(20+i*1310,40))
sh.save('logo-sheet.png')
