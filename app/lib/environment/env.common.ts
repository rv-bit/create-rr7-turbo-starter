import { z } from "zod";

const publicEnvSchema = z.object({
	VITE_BASE_URL: z.string().min(1, ""),
	VITE_DEFAULT_EMAIL: z.string().min(1, ""),
	VITE_HELP_EMAIL: z.string().min(1, ""),
});

function makeTypeEnv<T>(schema: { parse: (data: unknown) => T }) {
	return (args: Record<string, unknown>) => {
		return schema.parse(args);
	};
}

const getPublicEnv = makeTypeEnv(publicEnvSchema);
export { getPublicEnv, makeTypeEnv, publicEnvSchema };
