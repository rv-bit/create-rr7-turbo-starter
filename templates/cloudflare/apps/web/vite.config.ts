import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { reactRouterDevTools } from "react-router-devtools";
import babel from "vite-plugin-babel";
import devtoolsJson from "vite-plugin-devtools-json";
import tsconfigPaths from "vite-tsconfig-paths";

import { defineConfig } from "vite";

const commonPlugins = [
	cloudflare({ viteEnvironment: { name: "ssr" }, configPath: "../../config/wrangler/wrangler-web.toml" }),
	devtoolsJson(),
	reactRouter(),
	tsconfigPaths(),
	babel({
		filter: /\.[jt]sx?$/,
		babelConfig: {
			presets: ["@babel/preset-typescript"],
			plugins: [["babel-plugin-react-compiler"]],
		},
	}),
	// @ts-ignore
	tailwindcss(),
];

const devPlugins = [reactRouterDevTools()];

const devConfig = {
	server: {
		port: 3000,
		cors: true,
	},

	plugins: [...devPlugins, ...commonPlugins],

	resolve: {
		alias: {
			"~": path.resolve(__dirname, "./app"),
		},
	},
};

const prodConfig = {
	build: {
		outDir: "build",
	},
	plugins: [...commonPlugins],
	resolve: {
		alias: {
			"react-dom/server": "react-dom/server.node",
			"~": path.resolve(__dirname, "./app"),
		},
	},
};

const config = process.env.NODE_ENV === "development" ? devConfig : prodConfig;

export default defineConfig({
	...config,
});
