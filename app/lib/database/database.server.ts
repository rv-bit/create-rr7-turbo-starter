import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2";

import { getEnv } from "../environment/env.server";

const pool = createPool({
	host: getEnv(import.meta.env).MYSQLHOST,
	user: getEnv(import.meta.env).MYSQLUSER,
	password: getEnv(import.meta.env).MYSQLPASSWORD,
	database: getEnv(import.meta.env).MYSQL_DATABASE,
});

const db = drizzle({
	logger: getEnv(import.meta.env).NODE_ENV === "development" ? true : false,
	client: pool,
});

export default db;
