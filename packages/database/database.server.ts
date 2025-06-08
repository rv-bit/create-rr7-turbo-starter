import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2";

import { getEnv } from "@stack/env";

console.log("Database connection", {
	host: getEnv(process.env).MYSQLHOST,
	user: getEnv(process.env).MYSQLUSER,
	database: getEnv(process.env).MYSQL_DATABASE,
});

const pool = createPool({
	host: getEnv(process.env).MYSQLHOST,
	user: getEnv(process.env).MYSQLUSER,
	password: getEnv(process.env).MYSQLPASSWORD,
	database: getEnv(process.env).MYSQL_DATABASE,
});

const db = drizzle({
	logger: getEnv(process.env).NODE_ENV === "development" ? true : false,
	client: pool,
});

console.log("Database connection established", db);

export default db;
