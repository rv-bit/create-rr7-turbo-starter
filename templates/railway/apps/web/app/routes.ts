import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	route("/api/auth/*", "routes/api/auth.ts"),
	route("/api/trpc/*", "routes/api/trpc.ts"),

	index("routes/home.tsx"),
] satisfies RouteConfig;
