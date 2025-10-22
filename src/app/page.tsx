"use client";
import { useEffect, useState } from "react";
import Workspace from "@/components/Workspace";
import { loadFabricPalettes } from "@/lib/palettes";

export default function Page() {
  const [palettes, setPalettes] = useState(loadFabricPalettes());
  useEffect(() => { setPalettes(loadFabricPalettes()); }, []);
  return (
    <main className="container py-8">
      <h1 className="text-2xl md:text-3xl font-semibold mb-3">Pixel Quilt</h1>
      <p className="text-sm text-neutral-600 mb-6">Upload an image, choose squares or hexes, map to Kona/Bella palettes, and download PDF/SVG/ZIP.</p>
      <Workspace palettes={palettes} />
    </main>
  );
}
