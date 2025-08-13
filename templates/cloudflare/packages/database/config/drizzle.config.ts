import "dotenv/config";
import { type Config, defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "../drizzle",
	schema: "./src/schema",

	dialect: "mysql",
	driver: "d1-http",
	dbCredentials: {
		databaseId: "4365d432-845c-432d-b11a-38bf8e06caff",
		accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
		token: process.env.CLOUDFLARE_TOKEN!,
	},

	verbose: true,
	strict: true,
} as Config);
