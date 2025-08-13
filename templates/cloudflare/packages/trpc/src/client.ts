import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";

import type { AppRouter } from "./routers";

export function createTRPCClientInstance(baseUrl: string) {
	return createTRPCClient<AppRouter>({
		links: [
			loggerLink({
				enabled: (op) => process.env.NODE_ENV === "development" || (op.direction === "down" && op.result instanceof Error),
			}),
			httpBatchLink({
				url: `${baseUrl}/api/trpc`,
				headers: () => {
					const headers = new Headers();
					headers.set("x-trpc-source", "react");
					return headers;
				},
			}),
		],
	});
}

export type TRPCClient = ReturnType<typeof createTRPCClientInstance>;
