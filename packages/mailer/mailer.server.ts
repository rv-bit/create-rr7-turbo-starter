import nodemailer from "nodemailer";

import { getEnv } from "@repo/env";
import logger from "@repo/utils/logger";

interface EmailProps {
	to: string;
	subject: string;
	text?: string;
	html?: string;
}

const transport = nodemailer.createTransport({
	host: getEnv(process.env).EMAIL_SMPT_HOST,
	port: parseInt(getEnv(process.env).EMAIL_SMPT_PORT),
	auth: {
		user: getEnv(process.env).EMAIL_SMPT_USER,
		pass: getEnv(process.env).EMAIL_SMPT_PASSWORD,
	},
	secure: getEnv(process.env).EMAIL_SMPT_SECURE === "true",
	tls: {
		rejectUnauthorized: false,
	},
});

if (process.env.NODE_ENV !== "test") {
	transport
		.verify()
		.then(() => logger.info("Connected to email server"))
		.catch(() => logger.warn("Unable to connect to email server. Make sure you have configured the SMTP options in .env"));
}

/**
 * Send an email
 * @param {EmailProps} options - The email options
 * @param {string} options.to - The email address to send the email to
 * @param {string} options.subject - The subject of the email
 * @param {string} [options.text] - The text version of the email
 * @param {string} [options.html] - The HTML version of the email
 * @returns {Promise}
 */
export const sendEmail = async (options: EmailProps) => {
	await transport.sendMail({
		from: getEnv(process.env).VITE_DEFAULT_EMAIL,
		...options,
	});
};
