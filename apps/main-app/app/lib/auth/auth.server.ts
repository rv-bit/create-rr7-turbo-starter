import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, createAuthMiddleware, emailOTP, twoFactor, username } from "better-auth/plugins";

import db from "@stack/db";
import * as schema from "@stack/db/schema";

import { getEnv } from "@stack/env";
import { getBaseUrl } from "@stack/utils";

import { sendEmail } from "@stack/mailer";
import * as EMAIL_TEMPLATES from "@stack/mailer/templates";

import * as APP_CONFIG from "~/resources/app-config";

const trustedOrigins = getEnv(process.env)
	.BETTER_TRUSTED_ORIGINS?.split(",")
	.map((origin) => {
		return origin.startsWith("http") ? origin : `https://${origin}`;
	});

export const auth = betterAuth({
	appName: APP_CONFIG.APP_NAME,
	database: drizzleAdapter(db, {
		provider: "mysql",
		schema: schema,
	}),

	basePath: "/api/auth",
	baseURL: getBaseUrl(),
	secret: getEnv(process.env).BETTER_AUTH_SECRET,
	trustedOrigins: trustedOrigins || ["http://localhost:3000"],

	socialProviders: {
		github: {
			clientId: getEnv(process.env).GITHUB_CLIENT_ID,
			clientSecret: getEnv(process.env).GITHUB_CLIENT_SECRET,
			scope: ["user:email", "read:user"],
			mapProfileToUser(profile) {
				return {
					name: profile.name,
					email: profile.email,
					image: profile.avatar_url,
					// username: createUniqueUsername(profile.login),
				};
			},
		},
		google: {
			clientId: getEnv(process.env).GOOGLE_CLIENT_ID,
			clientSecret: getEnv(process.env).GOOGLE_CLIENT_SECRET,
			scope: ["email", "profile"],
			mapProfileToUser(profile) {
				return {
					name: profile.given_name,
					email: profile.email,
					image: profile.picture,
					// username: createUniqueUsername(profile.given_name + profile.family_name),
				};
			},
		},
	},

	account: {
		accountLinking: {
			enabled: true,
			// allowDifferentEmails: true,
			trustedProviders: ["google", "github"],
		},
	},

	user: {
		changeEmail: {
			enabled: true,
			sendChangeEmailVerification: async ({ user, newEmail, url, token }, request) => {
				await sendEmail({
					to: user.email, // verification email must be sent to the current user email to approve the change
					subject: `Approve email change to - ${newEmail}`,
					text: `Click the link to approve the change: ${url}`,
				});
			},
		},
		deleteUser: {
			enabled: true,
			sendDeleteAccountVerification: async ({ user, url, token }, request) => {
				await sendEmail({
					to: user.email,
					subject: "Delete your account",
					text: `Click the link to delete your account: ${url}`,
				});
			},
		},
	},

	emailAndPassword: {
		enabled: true,
		sendResetPassword: async ({ user, url, token }, request) => {
			await sendEmail({
				to: user.email,
				subject: "Reset your password",
				html: await EMAIL_TEMPLATES.reactResetPasswordEmail({
					username: user.name,
					resetLink: url,
				}),
			});
		},
	},

	hooks: {
		before: createAuthMiddleware(async (ctx) => {
			switch (ctx.path) {
				case "/update-user":
					break;
				default:
					break;
			}
		}),
		after: createAuthMiddleware(async (ctx) => {
			// switch (ctx.query?.error) {
			// 	case "account_already_linked_to_different_user":
			// 		throw ctx.redirect(`${url}/?error=Account already linked to different user`);
			// 	case "email_doesn't_match":
			// 		throw ctx.redirect(`${url}/?error=Email doesn't match`);
			// 	default:
			// 		break;
			// }
		}),
	},

	session: {
		expiresIn: 60 * 60 * 24 * 2, // 2 days
		updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
		freshAge: 60 * 60 * 24, // 1 day (session is fresh for 1 day)

		cookieCache: {
			enabled: true,
			maxAge: 60, // 60 seconds
		},
	},

	rateLimit: {
		window: 40, // time window in seconds
		max: 100, // max requests in the window
		customRules: {
			"/sign-in/email": {
				window: 10,
				max: 3,
			},
			"/two-factor/*": async (request) => {
				return {
					window: 10,
					max: 3,
				};
			},
		},
	},

	plugins: [
		username(),
		admin(),
		twoFactor({
			issuer: APP_CONFIG.APP_NAME,
			otpOptions: {
				async sendOTP({ user, otp }, request) {
					await sendEmail({
						to: user.email,
						subject: "Two factor authentication OTP",
						text: `Your OTP is: ${otp}`,
					});
				},
			},
		}),

		emailOTP({
			async sendVerificationOTP({ email, otp, type }) {
				if (type === "sign-in") {
					await sendEmail({
						to: email,
						subject: "Sign in OTP",
						text: `Your OTP is: ${otp}`,
					});
				} else if (type === "email-verification") {
					await sendEmail({
						to: email,
						subject: "Email verification OTP",
						text: `Your OTP is: ${otp}`,
					});
				} else {
					await sendEmail({
						to: email,
						subject: "Password reset OTP",
						text: `Your OTP is: ${otp}`,
					});
				}
			},
			otpLength: 6,
			expiresIn: 600, // 10 minutes
		}),
	],
});
