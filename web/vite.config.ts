import path from "node:path";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		TanStackRouterVite({
			target: "react",
			autoCodeSplitting: true,
			routesDirectory: "src/client/routes",
			generatedRouteTree: "src/client/routeTree.gen.ts",
			routeToken: "layout",
		}),
		react(),
		cloudflare(),
		tailwindcss(),
	],
	resolve: {
		alias: {
			"@client": path.resolve(__dirname, "./src/client/"),
			"@server": path.resolve(__dirname, "./src/server/"),
		},
	},
});
