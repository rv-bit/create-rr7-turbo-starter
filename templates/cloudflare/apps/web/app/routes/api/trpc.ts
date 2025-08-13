// import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

// import type { ActionFunctionArgs, AppLoadContext, LoaderFunctionArgs } from "react-router";

// import { appRouter } from "~/server/main";
// import { createTRPCContext } from "~/server/trpc";

// export const loader = async (args: LoaderFunctionArgs) => {
// 	return handleRequest(args);
// };

// export const action = async (args: ActionFunctionArgs) => {
// 	return handleRequest(args);
// };

// function handleRequest(args: LoaderFunctionArgs | ActionFunctionArgs) {
// 	const appLoadContext = args.context as AppLoadContext;

// 	return fetchRequestHandler({
// 		endpoint: "/api/trpc",
// 		req: args.request,
// 		router: appRouter,
// 		createContext: () =>
// 			createTRPCContext({
// 				headers: args.request.headers,
// 				ctx: appLoadContext, // this includes db and cloudflare env
// 			}),
// 	});
// }

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { ActionFunctionArgs, AppLoadContext, LoaderFunctionArgs } from "react-router";

import { cors } from "remix-utils/cors";

import { appRouter, createTRPCContext } from "@org/trpc";

import { trustedOrigins } from "~/lib/origins";

const corsOptions = {
	origin: trustedOrigins,
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization", "x-trpc-source", "x-trpc-batch", "x-trpc-procedures"],
	credentials: true,
	maxAge: 86400, // 24 hours
};

export async function loader(args: LoaderFunctionArgs) {
	const request = args.request;

	// Handle preflight requests
	if (request.method === "OPTIONS") {
		const response = new Response(null, { status: 200 });
		return await cors(request, response, corsOptions);
	}

	// Apply CORS first, then handle the request
	const response = await handleRequest(args);
	return await cors(request, response, corsOptions);
}

export async function action(args: ActionFunctionArgs) {
	const request = args.request;

	// Handle preflight requests
	if (request.method === "OPTIONS") {
		const response = new Response(null, { status: 200 });
		return await cors(request, response, corsOptions);
	}

	// Apply CORS first, then handle the request
	const response = await handleRequest(args);
	return await cors(request, response, corsOptions);
}

function handleRequest(args: LoaderFunctionArgs | ActionFunctionArgs) {
	const ctx = args.context as AppLoadContext;
	const headers = args.request.headers;

	return fetchRequestHandler({
		endpoint: "/api/trpc",
		req: args.request,
		router: appRouter,
		createContext: () =>
			createTRPCContext({
				ctx,
				headers,
			}),
		onError:
			process.env.NODE_ENV === "development"
				? ({ path, error }) => {
						console.error(`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`);
					}
				: undefined,
	});
}
