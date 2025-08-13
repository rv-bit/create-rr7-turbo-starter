import { cache, type PropsWithChildren } from "react";

import { defaultShouldDehydrateQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import superjson from "superjson";

import { trpc } from "~/lib/trpc/trpc";

import type { AppRouter } from "@org/trpc";

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

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
export const TRPCReactProvider = ({ children }: PropsWithChildren) => {
	const queryClient = getQueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<TRPCProvider trpcClient={trpc} queryClient={queryClient}>
				{children}
			</TRPCProvider>
		</QueryClientProvider>
	);
};
