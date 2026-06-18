import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

// Plain Vite SPA configuration for GitHub Pages deployment.
export default defineConfig({
	base: "/store/",
	plugins: [tailwindcss(), react(), tsconfigPaths()],
	build: {
		outDir: "dist/client",
	},
});
