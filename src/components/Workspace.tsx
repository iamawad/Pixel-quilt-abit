"use client";
import { useEffect, useRef, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { quantizeAndMap, type FabricPalette, type MappedGrid, exportSVG, exportPDF, exportPNG } from "@/lib/pipeline";
import { computeSquareGrid, computeHexGrid } from "@/lib/grids";

export default function Workspace({ palettes }: { palettes: FabricPalette[] }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [mode, setMode] = useState<"square" | "hex">("square");
  const [patch, setPatch] = useState(2);
  const [seam, setSeam] = useState(0.25);
  const [quiltW, setQuiltW] = useState(60);
  const [quiltH, setQuiltH] = useState(80);
  const [colors, setColors] = useState(16);
  const [paletteId, setPaletteId] = useState<string>("kona-classic");
  const [mapped, setMapped] = useState<MappedGrid | null>(null);
  const [busy, setBusy] = useState(false);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!/^image\/(png|jpe?g)$/i.test(f.type)) { alert("Please upload a PNG or JPG"); return; }
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => { setImage(img); URL.revokeObjectURL(url); };
    img.src = url;
  }

  useEffect(() => {
    (async () => {
      if (!image) return;
      setBusy(true);
      const { cols, rows, sampler } = mode === "square"
        ? computeSquareGrid(image, quiltW, quiltH, patch)
        : computeHexGrid(image, quiltW, quiltH, patch);
      const res = await quantizeAndMap({ sampler, rows, cols, colors, paletteId });
      setMapped(res);
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) { setBusy(false); return; }
      const scale = 6;
      canvasRef.current!.width = cols * scale;
      canvasRef.current!.height = rows * scale;
      const imageData = ctx.createImageData(cols * scale, rows * scale);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const sw = res.grid[r * cols + c];
          for (let y = 0; y < scale; y++) {
            for (let x = 0; x < scale; x++) {
              const idx = ((r * scale + y) * (cols * scale) + (c * scale + x)) * 4;
              imageData.data[idx+0] = sw.rgb[0];
              imageData.data[idx+1] = sw.rgb[1];
              imageData.data[idx+2] = sw.rgb[2];
              imageData.data[idx+3] = 255;
            }
          }
        }
      }
      ctx.putImageData(imageData, 0, 0);
      setBusy(false);
    })();
  }, [image, mode, quiltW, quiltH, patch, colors, paletteId]);

  async function doExport() {
    if (!mapped) return;
    setBusy(true);
    const svg = exportSVG({ mapped, mode, patch, seam, quiltW, quiltH });
    const pdf = await exportPDF({ mapped, mode, patch, seam, quiltW, quiltH });
    const png = await exportPNG(canvasRef.current!);
    const zip = new JSZip();
    zip.file("pattern.svg", svg);
    zip.file("pattern.pdf", pdf, { binary: true });
    zip.file("preview.png", png.split(",")[1]!, { base64: true });
    zip.file("spec.json", JSON.stringify(mapped.spec, null, 2));
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `pixel-quilt-${Date.now()}.zip`);
    setBusy(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <input ref={fileRef} onChange={onFile} type="file" accept="image/*" className="block" />
          <select value={mode} onChange={e=>setMode(e.target.value as any)} className="border rounded px-2 py-1">
            <option value="square">Squares</option>
            <option value="hex">Hexagons</option>
          </select>
          <button onClick={doExport} disabled={!mapped || busy} className="px-3 py-1 rounded bg-neutral-900 text-white disabled:opacity-40">{busy?"Working…":"Download ZIP"}</button>
        </div>
        <canvas ref={canvasRef} className="w-full max-w-[1200px] border rounded bg-white" />
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-xs">Patch size (inches, finished)</label>
          <input type="number" value={patch} min={0.5} max={6} step={0.25} onChange={e=>setPatch(parseFloat(e.target.value))} className="w-full border rounded px-2 py-1"/>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs">Quilt width (in)</label>
            <input type="number" value={quiltW} min={12} max={150} step={1} onChange={e=>setQuiltW(parseInt(e.target.value))} className="w-full border rounded px-2 py-1"/>
          </div>
          <div>
            <label className="block text-xs">Quilt height (in)</label>
            <input type="number" value={quiltH} min={12} max={150} step={1} onChange={e=>setQuiltH(parseInt(e.target.value))} className="w-full border rounded px-2 py-1"/>
          </div>
        </div>
        <div>
          <label className="block text-xs">Colors</label>
          <input type="number" value={colors} min={2} max={64} step={1} onChange={e=>setColors(parseInt(e.target.value))} className="w-full border rounded px-2 py-1"/>
        </div>
        <div>
          <label className="block text-xs">Palette</label>
          <select value={paletteId} onChange={e=>setPaletteId(e.target.value)} className="w-full border rounded px-2 py-1">
            {palettes.map(p=> (<option key={p.id} value={p.id}>{p.name}</option>))}
          </select>
        </div>
        <div className="text-xs text-neutral-600">
          Rows/Cols & yardage will be computed in PDF export. This is an MVP; we can add advanced color swap/locks next.
        </div>
      </div>
    </div>
  );
}
