import "dotenv/config";
import { type Config, defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "mysql",
	schema: "./schema",

	dbCredentials: {
		url: process.env.MYSQL_URL,
	},

	verbose: true,
	strict: true,
} as Config);
