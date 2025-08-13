import { getEnv } from "@org/environment";

export const trustedOrigins = getEnv(process.env)
	.BETTER_TRUSTED_ORIGINS?.split(",")
	.map((origin) => {
		return origin.startsWith("http") ? origin : `https://${origin}`;
	});
