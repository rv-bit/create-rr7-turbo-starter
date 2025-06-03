import { z } from "zod";

import { makeTypeEnv, publicEnvSchema } from "./env.common";

const envSchema = publicEnvSchema.extend({
	MYSQLHOST: z.string().min(1, "MYSQLHOST must be set"),
	MYSQLUSER: z.string().min(1, "MYSQLUSER must be set"),
	MYSQLPASSWORD: z.string().min(1, "MYSQLPASSWORD must be set"),
	MYSQL_DATABASE: z.string().min(1, "MYSQL_DATABASE must be set"),
	MYSQL_URL: z.string().min(1, "MYSQL_URL must be set"),
	MYSQL_PORT: z.string().optional(),

	BETTER_AUTH_URL: z.string().min(1, "BETTER_AUTH_URL must be set"),
	BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET must be set"),
	BETTER_TRUSTED_ORIGINS: z.string().min(1, "BETTER_TRUSTED_ORIGINS must be set"),

	GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID must be set"),
	GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET must be set"),

	GITHUB_CLIENT_ID: z.string().min(1, "GITHUB_CLIENT_ID must be set"),
	GITHUB_CLIENT_SECRET: z.string().min(1, "GITHUB_CLIENT_SECRET must be set"),

	EMAIL_SMPT_HOST: z.string().min(1, "EMAIL_SMPT_HOST must be set"),
	EMAIL_SMPT_PORT: z.string().min(1, "EMAIL_SMPT_PORT must be set"),
	EMAIL_SMPT_USER: z.string().min(1, "EMAIL_SMPT_USER must be set"),
	EMAIL_SMPT_PASSWORD: z.string().min(1, "EMAIL_SMPT_PASSWORD must be set"),
	EMAIL_SMPT_SECURE: z.string().optional(),

	NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const getEnv = makeTypeEnv(envSchema);
export { getEnv };
