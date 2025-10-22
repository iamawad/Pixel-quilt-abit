export type RGB = [number, number, number];
export type LAB = [number, number, number];

export function rgbToLab([r,g,b]: RGB): LAB {
  r/=255;g/=255;b/=255;
  r=r>0.04045?((r+0.055)/1.055)**2.4:r/12.92;
  g=g>0.04045?((g+0.055)/1.055)**2.4:g/12.92;
  b=b>0.04045?((b+0.055)/1.055)**2.4:b/12.92;
  const x=r*0.4124+g*0.3576+b*0.1805;
  const y=r*0.2126+g*0.7152+b*0.0722;
  const z=r*0.0193+g*0.1192+b*0.9505;
  const xn=0.95047, yn=1, zn=1.08883;
  const f=(t:number)=> t>0.008856?Math.cbrt(t):(7.787*t+16/116);
  const fx=f(x/xn), fy=f(y/yn), fz=f(z/zn);
  return [116*fy-16, 500*(fx-fy), 200*(fy-fz)];
}

// CIEDE2000 ΔE
export function deltaE(lab1: LAB, lab2: LAB): number {
  const [L1,a1,b1]=lab1,[L2,a2,b2]=lab2; const kL=1,kC=1,kH=1;
  const C1=Math.hypot(a1,b1), C2=Math.hypot(a2,b2);
  const Cm=(C1+C2)/2;
  const G=0.5*(1-Math.sqrt((Cm**7)/((Cm**7)+6103515625)));
  const a1p=(1+G)*a1, a2p=(1+G)*a2;
  const C1p=Math.hypot(a1p,b1), C2p=Math.hypot(a2p,b2);
  const h1p=(Math.atan2(b1,a1p)+2*Math.PI)%(2*Math.PI);
  const h2p=(Math.atan2(b2,a2p)+2*Math.PI)%(2*Math.PI);
  const dLp=L2-L1; const dCp=C2p-C1p;
  let dhp=h2p-h1p; if(dhp>Math.PI) dhp-=2*Math.PI; if(dhp<-Math.PI) dhp+=2*Math.PI; if(C1p*C2p===0) dhp=0;
  const dHp=2*Math.sqrt(C1p*C2p)*Math.sin(dhp/2);
  const Lpm=(L1+L2)/2; const Cpm=(C1p+C2p)/2;
  let hpm=h1p+h2p; if(Math.abs(h2p-h1p)>Math.PI) hpm+=2*Math.PI; hpm/=2; if(C1p*C2p===0) hpm=h1p+h2p;
  const T=1-0.17*Math.cos(hpm- Math.PI/6)+0.24*Math.cos(2*hpm)+0.32*Math.cos(3*hpm+ Math.PI/30)-0.20*Math.cos(4*hpm-63*Math.PI/180);
  const dRo=30*Math.PI/180*Math.exp(-(((180/Math.PI*hpm-275)/25)**2));
  const RC=2*Math.sqrt((Cpm**7)/((Cpm**7)+6103515625));
  const SL=1+((0.015*(Lpm-50)**2)/Math.sqrt(20+(Lpm-50)**2));
  const SC=1+0.045*Cpm; const SH=1+0.015*Cpm*T;
  const RT=-Math.sin(2*dRo)*RC;
  return ((dLp/(kL*SL))**2+(dCp/(kC*SC))**2+(dHp/(kH*SH))**2+RT*(dCp/(kC*SC))*(dHp/(kH*SH)))**0.5;
}
