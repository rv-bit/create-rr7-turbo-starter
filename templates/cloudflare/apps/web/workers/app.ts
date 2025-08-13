import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import { createRequestHandler } from "react-router";

import { createAuthInstance } from "@org/auth";
import * as schema from "@org/db/schema";

import type { Auth } from "@org/auth";

import { getEnv } from "@org/environment";
import { getBaseUrl } from "@org/utils";

import * as APP_CONFIG from "~/resources/app-config";

import { trustedOrigins } from "~/lib/origins";

declare module "react-router" {
	export interface AppLoadContext {
		cloudflare: {
			env: Env;
			ctx: ExecutionContext;
		};
		db: DrizzleD1Database<typeof schema>;
		auth: Auth;
	}
}

const requestHandler = createRequestHandler(() => import("virtual:react-router/server-build"), import.meta.env.MODE);

export default {
	async fetch(request, env, ctx) {
		const db = drizzle(env.DB, { schema });
		const auth = await createAuthInstance({
			secret: getEnv(process.env).BETTER_AUTH_SECRET,
			baseURL: getBaseUrl(),
			trustedOrigins: trustedOrigins,
			appSettings: {
				appName: APP_CONFIG.APP_NAME,
			},
			db: db,
		});

		return requestHandler(request, {
			cloudflare: { env, ctx },
			db,
			auth,
		});
	},
} satisfies ExportedHandler<Env>;
