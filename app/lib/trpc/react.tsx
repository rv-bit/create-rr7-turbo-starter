import { type PropsWithChildren, cache, useState } from "react";

import { QueryClient, QueryClientProvider, defaultShouldDehydrateQuery } from "@tanstack/react-query";
import { createTRPCClient, httpBatchStreamLink, loggerLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import superjson from "superjson";

import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/main";

import { getBaseUrl } from "~/lib/utils";

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000,
			},
			dehydrate: {
				serializeData: superjson.serialize,
				shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === "pending",
			},
			hydrate: {
				deserializeData: superjson.deserialize,
			},
		},
	});
}

let browserQueryClient: QueryClient | undefined = undefined;

export const getQueryClient = cache(() => {
	if (typeof window === "undefined") return makeQueryClient();

	browserQueryClient ??= makeQueryClient();

	return browserQueryClient;
});

const links = [
	loggerLink({
		enabled: (op) => process.env.NODE_ENV === "development" || (op.direction === "down" && op.result instanceof Error),
	}),
	httpBatchStreamLink({
		transformer: superjson,
		url: `${getBaseUrl()}/api/trpc`,
		headers() {
			const headers = new Headers();
			headers.set("x-trpc-source", "react");
			return headers;
		},
	}),
];

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
export const TRPCReactProvider = ({ children }: PropsWithChildren) => {
	const queryClient = getQueryClient();
	const [trpcClient] = useState(() =>
		createTRPCClient<AppRouter>({
			links,
		}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			<TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
				{children}
			</TRPCProvider>
		</QueryClientProvider>
	);
};

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
