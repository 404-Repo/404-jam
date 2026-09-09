import numpy as np, sys
from PIL import Image, ImageFilter
S='/private/tmp/claude-501/-Users-atlas/0d4013b9-fa93-4edd-94a0-a8b866e7701b/scratchpad/mine/'
src={'t_drive_a':'work/grade/t_drive_a.jpg','t_rust_a':'work/grade/t_rust_a.jpg','t_harvest':S+'harvest/01_started.png','t_stall':S+'nightmarket2/f6.png','t_apartment':S+'apartment/f4.png','t_nivalis':S+'nivalis2/f2.png'}
# per image: how far to pull the median (night scenes stay night, but readable at thumbnail size)
TARGET_MED={'t_drive_a':0.46,'t_rust_a':0.55,'t_harvest':0.36,'t_stall':0.20,'t_apartment':0.14,'t_nivalis':0.44}
TARGET_SAT=0.37
def luma(a): return 0.2126*a[...,0]+0.7152*a[...,1]+0.0722*a[...,2]
def grade(a,k):
    # 1 levels: black and white points to a shared floor and ceiling
    y=luma(a); lo=np.percentile(y,1.0); hi=np.percentile(y,99.5)
    a=(a-lo)/max(hi-lo,1e-3); a=np.clip(a,0,1); a=a*0.95+0.02
    # 2 gamma so the median lands where the set wants it
    med=np.median(luma(a)); g=np.log(TARGET_MED[k])/np.log(max(med,1e-3)); g=float(np.clip(g,0.6,1.6)); a=np.power(a,g)
    # 3 saturation toward one level
    y=luma(a)[...,None]; mx=a.max(-1); mn=a.min(-1); sat=np.where(mx>0,(mx-mn)/np.maximum(mx,1e-6),0).mean()
    f=float(np.clip(TARGET_SAT/max(sat,1e-3),0.75,1.25)); a=np.clip(y+(a-y)*f,0,1)
    # 3b measure again after the curve and clamp the outliers so no cell shouts
    y=luma(a)[...,None]; mx=a.max(-1); mn=a.min(-1); sat=np.where(mx>0,(mx-mn)/np.maximum(mx,1e-6),0).mean()
    if sat>0.44: a=np.clip(y+(a-y)*(0.44/sat),0,1)
    # 4 a gentle shared S curve and a hint of warmth in the shadows, cool in the highlights (one look)
    a=np.clip(0.5+(a-0.5)*1.06,0,1)
    y=luma(a)[...,None]; tint=np.array([0.012,0.0,-0.012],dtype=np.float32)*(1-y)+np.array([-0.006,0.0,0.008],dtype=np.float32)*y
    a=np.clip(a+tint,0,1)
    return a
out={}
for k,p in src.items():
    im=Image.open(p).convert('RGB').resize((720,405), Image.LANCZOS); a=np.asarray(im).astype(np.float32)/255
    b=grade(a,k); im2=Image.fromarray((b*255+0.5).astype(np.uint8)).filter(ImageFilter.UnsharpMask(radius=1.2,percent=45,threshold=2))
    out[k]=(im,im2)
    y=luma(b); mx=b.max(-1); mn=b.min(-1); sat=np.where(mx>0,(mx-mn)/np.maximum(mx,1e-6),0).mean()
    print(f"{k:12s} after: black {np.percentile(y,2):.2f} med {np.median(y):.2f} white {np.percentile(y,98):.2f} sat {sat:.2f}")
    if '--write' in sys.argv: im2.save(f'media/{k}.jpg', quality=84, optimize=True)
order=['t_drive_a','t_rust_a','t_harvest','t_stall','t_apartment','t_nivalis']
W,H=360,203; sheet=Image.new('RGB',(W*3,H*4),(242,242,242))
for i,k in enumerate(order):
    sheet.paste(out[k][0].resize((W,H)),( (i%3)*W, (i//3)*H)); sheet.paste(out[k][1].resize((W,H)),((i%3)*W,(2+i//3)*H))
sheet.save('work/grade/before_after.png'); print('sheet: top two rows before, bottom two rows after')
