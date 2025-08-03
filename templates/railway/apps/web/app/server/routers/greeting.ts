import { eq } from "drizzle-orm";

import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure, publicProcedure } from "~/server/trpc";

import * as schema from "@repo/db/schema";

export const greetingRouter = {
	hello: publicProcedure.query(() => {
		return "Hello World!";
	}),
	user: protectedProcedure.query(async ({ input, ctx }) => {
		const user = await ctx.db.select().from(schema.user).where(eq(schema.user.id, ctx.user?.id));
		return user;
	}),
} satisfies TRPCRouterRecord;
