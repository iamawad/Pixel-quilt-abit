export function computeSquareGrid(img: HTMLImageElement, quiltW: number, quiltH: number, patch: number) {
  const cols = Math.max(2, Math.floor(quiltW / patch));
  const rows = Math.max(2, Math.floor(quiltH / patch));

  const cv = document.createElement('canvas');
  cv.width = img.width; cv.height = img.height;
  const ctx = cv.getContext('2d')!; ctx.drawImage(img,0,0);

  const sampler = (r: number, c: number): [number,number,number] => {
    const cx = Math.floor((c + 0.5) / cols * img.width);
    const cy = Math.floor((r + 0.5) / rows * img.height);
    const cc = ctx.getImageData(cx, cy, 1, 1).data;
    return [cc[0], cc[1], cc[2]];
  };
  return { rows, cols, sampler };
}

export function computeHexGrid(img: HTMLImageElement, quiltW: number, quiltH: number, patch: number) {
  const eff = patch * 0.866;
  const cols = Math.max(2, Math.floor(quiltW / eff));
  const rows = Math.max(2, Math.floor(quiltH / eff));

  const cv = document.createElement('canvas');
  cv.width = img.width; cv.height = img.height;
  const ctx = cv.getContext('2d')!; ctx.drawImage(img,0,0);
  const sampler = (r: number, c: number): [number,number,number] => {
    const cx = Math.floor((c + 0.5) / cols * img.width);
    const cy = Math.floor((r + 0.5) / rows * img.height);
    const cc = ctx.getImageData(cx, cy, 1, 1).data;
    return [cc[0], cc[1], cc[2]];
  };
  return { rows, cols, sampler };
}
