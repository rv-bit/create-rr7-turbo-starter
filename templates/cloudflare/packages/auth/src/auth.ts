import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin as adminPlugin, createAuthMiddleware, emailOTP, twoFactor, username } from "better-auth/plugins";

import { ac, admin, defaultRoles } from "@org/auth/permissions";

import * as schema from "@org/db/schema";

import { getEnv } from "@org/environment";
import { getBaseUrl } from "@org/utils";

import { sendEmail } from "@org/mailer";
import * as EMAIL_TEMPLATES from "@org/mailer/templates";

import { type DrizzleD1Database } from "drizzle-orm/d1";

export async function createAuthInstance(opts: {
	secret: string;
	baseURL: string;
	trustedOrigins?: string[];
	appSettings: {
		appName: string;
	};
	db: DrizzleD1Database<typeof schema>;
}): Promise<ReturnType<typeof betterAuth>> {
	return betterAuth({
		appName: opts.appSettings.appName,
		database: drizzleAdapter(opts.db, {
			provider: "mysql",
			schema: schema,
		}),

		baseURL: opts.baseURL,
		secret: opts.secret,
		trustedOrigins: opts.trustedOrigins,

		socialProviders: {
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
				trustedProviders: ["google", "facebook"],
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
				switch (ctx.query?.error) {
					case "account_already_linked_to_different_user":
						throw ctx.redirect(`${getBaseUrl()}/?error=Account already linked to different user`);
					case "email_doesn't_match":
						throw ctx.redirect(`${getBaseUrl()}/?error=Email doesn't match`);
					default:
						break;
				}
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
			enabled: getEnv(process.env).NODE_ENV === "production", // enable rate limiting in production
			window: 10, // time window in seconds
			max: 100, // max requests in the window
		},

		advanced: {
			cookiePrefix: opts.appSettings.appName.toLowerCase().replace(/\s+/g, "-"),
			crossSubDomainCookies: {
				enabled: getEnv(process.env).NODE_ENV === "production", // enable cross subdomain cookies in production
				domain: ".railway.app", // set your domain here
			},
		},

		plugins: [
			username(),
			adminPlugin({
				// Use the default roles from the shared package
				defaultRoles,

				// Pass the access control and roles
				ac,
				roles: {
					admin,
				},
			}),
			twoFactor({
				issuer: opts.appSettings.appName,
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
}

export type Auth = Awaited<ReturnType<typeof createAuthInstance>>;
