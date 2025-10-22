import { FabricPalette } from "@/lib/palettes";
import { rgbToLab, deltaE, type RGB } from "@/lib/color";

export type Cell = { rgb: RGB; swatchId: string };
export type MappedGrid = { rows: number; cols: number; grid: Cell[]; palette: FabricPalette; spec: any };

export async function quantizeAndMap({ sampler, rows, cols, colors, paletteId }: { sampler: (r:number,c:number)=>RGB; rows:number; cols:number; colors:number; paletteId:string }): Promise<MappedGrid> {
  const palettes = (await import("@/lib/palettes")).loadFabricPalettes();
  const palette = palettes.find(p=>p.id===paletteId)!;
  const grid: Cell[] = new Array(rows*cols);
  for (let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      const rgb = sampler(r,c);
      const lab = rgbToLab(rgb);
      let best = palette.swatches[0];
      let bestE = Infinity;
      for (const sw of palette.swatches){
        const de = deltaE(lab, sw.lab as any);
        if (de < bestE){ bestE = de; best = sw; }
      }
      grid[r*cols+c] = { rgb: best.rgb as RGB ?? rgb, swatchId: best.id };
    }
  }
  const spec = { rows, cols, paletteId, colors, createdAt: Date.now() };
  return { rows, cols, grid, palette, spec };
}

export function exportSVG({ mapped, mode, patch, seam, quiltW, quiltH }: { mapped: MappedGrid, mode: "square"|"hex", patch:number, seam:number, quiltW:number, quiltH:number }): string {
  const { rows, cols, grid } = mapped;
  const cell = patch;
  const dpi = 96; const pxPerIn = dpi; const w = cols*cell*pxPerIn, h = rows*cell*pxPerIn;
  let body = "";
  for (let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      const g = grid[r*cols+c];
      const [R,G,B] = g.rgb; const x = c*cell*pxPerIn; const y = r*cell*pxPerIn;
      body += `<rect x="${x}" y="${y}" width="${cell*pxPerIn}" height="${cell*pxPerIn}" fill="rgb(${R},${G},${B})" />`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${body}</svg>`;
}

export async function exportPDF(args: { mapped: MappedGrid, mode: "square"|"hex", patch:number, seam:number, quiltW:number, quiltH:number }): Promise<Uint8Array> {
  const svg = exportSVG(args);
  const enc = new TextEncoder();
  const pdf = f"%PDF-1.4\n%âãÏÓ\nSVG EXPORT PLACEHOLDER. Open pattern.svg for vector map.\n";
  return enc.encode(pdf);
}

export async function exportPNG(canvas: HTMLCanvasElement): Promise<string> {
  return canvas.toDataURL("image/png");
}
