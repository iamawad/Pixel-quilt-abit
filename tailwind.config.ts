import type { Config } from "tailwindcss";
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: { container: { center: true, padding: "1rem" } } },
  plugins: [require("tailwindcss-animate")]
} satisfies Config;
