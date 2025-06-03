import "dotenv/config";
import { type Config, defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "mysql",
	schema: "./app/lib/database/schema",

	dbCredentials: {
		url: process.env.MYSQL_URL,
	},

	verbose: true,
	strict: true,
} as Config);
