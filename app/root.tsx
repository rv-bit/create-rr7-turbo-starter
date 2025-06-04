import globalStyleSheet from "./styles/global.css?url";

import { parse } from "cookie";
import React from "react";
import { data, Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "react-router";

import type { Route } from "./+types/root";

import { getPublicEnv } from "./lib/environment/env.common";

import { APP_DESCRIPTION, APP_NAME, APP_URL } from "./resources/app-config";
import { THEME_COOKIE_NAME } from "./resources/cookie-config";

import useNonce from "./hooks/useNonce";
import useRootLoader from "./hooks/useRootLoader";

import { GeneralErrorBoundary } from "./components/error-boundary";

import Providers from "./providers";

export const links: Route.LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
	},
	{ rel: "stylesheet", href: globalStyleSheet as string }, // Ensure the global styles are loaded
];

export const meta: Route.MetaFunction = () => {
	return [{ title: APP_NAME }, { name: "description", content: APP_DESCRIPTION }];
};

export async function loader({ request }: Route.LoaderArgs) {
	const cookie = parse(request.headers.get("cookie") ?? "");
	const cachedTheme = cookie[THEME_COOKIE_NAME] ?? "system";

	return data({
		theme: cachedTheme as "light" | "dark" | "system",
		publicEnv: getPublicEnv(import.meta.env),
	});
}

function Document({ children, nonce, theme = "light" }: { children: React.ReactNode; nonce?: string; theme: "light" | "dark" }) {
	return (
		<html lang="en" className={`${theme} h-full overflow-x-hidden`} suppressHydrationWarning>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />

				<Meta />
				<Links />

				<meta name="og:title" content={APP_NAME} />
				<meta name="og:description" content={APP_DESCRIPTION} />
				<meta name="og:type" content="website" />
				<meta name="og:url" content={APP_URL} />

				<script
					dangerouslySetInnerHTML={{
						__html: `
							(function() {
								const cookieMatch = document.cookie.match(new RegExp("(^| )${THEME_COOKIE_NAME}=([^;]+)"))
								const cachedTheme = cookieMatch ? (cookieMatch[2]) : 'light'

								document.documentElement.classList.toggle('dark', cachedTheme === 'dark' || (!(document.cookie.match(new RegExp("(^| )${THEME_COOKIE_NAME}=([^;]+)"))) && window.matchMedia('(prefers-color-scheme: dark)').matches))
							})();
						`,
					}}
				/>
			</head>
			<body>
				{children}
				<ScrollRestoration nonce={nonce} />
				<Scripts nonce={nonce} />
			</body>
		</html>
	);
}

export function Layout({ children }: { children: React.ReactNode }) {
	// Use the root loader to get the theme from cookies and determine the system preference
	const { theme: cookieTheme } = useRootLoader();
	const systemPreferenceDark = typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)").matches : false;
	const theme = cookieTheme === "system" ? (systemPreferenceDark ? "dark" : "light") : (cookieTheme ?? "light");

	const nonce = useNonce();

	return (
		<Document nonce={nonce} theme={theme}>
			{children}
		</Document>
	);
}

export default function App() {
	const loaderData = useLoaderData<typeof loader>();

	return (
		<Providers>
			<Outlet />
		</Providers>
	);
}

export const ErrorBoundary = GeneralErrorBoundary;
