import type { AppLoadContext } from "react-router";

export async function createTRPCContext(opts: { headers: Headers; ctx: AppLoadContext }) {
	const session = await opts.ctx.auth.api.getSession({
		headers: opts.headers,
	});

	const source = opts.headers.get("x-trpc-source") ?? "unknown";
	console.log(">>> tRPC Request from", source, "by", session?.user.name);

	return {
		user: session?.user || null,
		session: session?.session || null,
		db: opts.ctx.db,
		auth: opts.ctx.auth,
	};
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
