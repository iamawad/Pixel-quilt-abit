import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Pixel Quilt – Pattern Generator",
  description: "Turn images into pixel/hex quilt patterns with real fabric palettes."
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
