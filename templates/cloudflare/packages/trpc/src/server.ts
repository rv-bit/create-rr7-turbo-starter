import { initTRPC, TRPCError } from "@trpc/server";
import { ZodError } from "zod";

import type { Context } from "./context";

const t = initTRPC.context<Context>().create({
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
			},
		};
	},
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

// Auth middleware
const enforceUserIsAuthed = middleware(async ({ ctx, next }) => {
	if (!ctx.user) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}
	return next({
		ctx: {
			...ctx,
			user: ctx.user, // Now guaranteed to be non-null
		},
	});
});

export const protectedProcedure = publicProcedure.use(enforceUserIsAuthed);
