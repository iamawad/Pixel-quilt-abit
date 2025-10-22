export type FabricSwatch = { id: string; name: string; sku?: string; rgb: [number,number,number]; lab: [number,number,number] };
export type FabricPalette = { id: string; name: string; swatches: FabricSwatch[] };

import { rgbToLab } from "@/lib/color";

const KONA_MINI: FabricPalette = {
  id: "kona-classic",
  name: "Kona (demo subset)",
  swatches: [
    ["White", [245,245,245]], ["Black", [20,20,20]], ["Silver", [190,190,190]],
    ["Ash", [140,140,140]], ["Snow", [250,250,248]], ["Coal", [60,60,60]],
    ["Lipstick", [178, 36, 52]], ["Goldfish", [244, 117, 33]], ["School Bus", [255, 183, 0]],
    ["Grasshopper", [86, 148, 64]], ["Pacific", [0, 102, 153]], ["Lapis", [47, 74, 141]],
    ["Mulberry", [134, 70, 142]], ["Ballerina", [242, 196, 213]], ["Chocolate", [92, 54, 37]]
  ].map(([name, rgb]: any, i: number) => ({ id: `kona-${i}`, name: name as string, rgb: rgb as [number,number,number], lab: rgbToLab(rgb as [number,number,number]) }))
};

const BELLA_MINI: FabricPalette = {
  id: "bella-basic",
  name: "Bella (demo subset)",
  swatches: [
    ["Snow", [250,250,248]],["Porcelain", [237,237,232]],["Etchings", [196,196,196]],["Lead", [89,89,89]],
    ["Scarlet", [192, 30, 45]],["Goldenrod", [219, 167, 27]],["Avocado", [114, 138, 57]],["Navy", [30, 47, 91]]
  ].map(([name, rgb]: any, i: number) => ({ id: `bella-${i}`, name, rgb, lab: rgbToLab(rgb) }))
};

export function loadFabricPalettes(): FabricPalette[] { return [KONA_MINI, BELLA_MINI]; }
