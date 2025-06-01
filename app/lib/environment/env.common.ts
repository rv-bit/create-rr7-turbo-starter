import { z } from "zod";

const publicEnvSchema = z.object({
	VITE_GOOGLE_MAPS_API_KEY: z.string().min(1, ""),
	VITE_STRIPE_PUBLIC_KEY: z.string().min(1, ""),
});

function makeTypeEnv<T>(schema: { parse: (data: unknown) => T }) {
	return (args: Record<string, unknown>) => {
		return schema.parse(args);
	};
}

const getPublicEnv = makeTypeEnv(publicEnvSchema);
export { getPublicEnv, makeTypeEnv, publicEnvSchema };
