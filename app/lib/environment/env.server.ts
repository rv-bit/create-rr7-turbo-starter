import { z } from "zod";

import { makeTypeEnv, publicEnvSchema } from "./env.common";

const envSchema = publicEnvSchema.extend({
	SESSION_SECRET: z.string().min(1, "SESSION_SECRET must be set"),
	STRIPE_SECRET_KEY: z.string().min(1, "STRIPE_SECRET_KEY must be set"),

	NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const getEnv = makeTypeEnv(envSchema);
export { getEnv };
