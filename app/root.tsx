import globalStyleSheet from "./styles/global.css?url";

import { data, Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "react-router";
import type { Route } from "./+types/root";

import { getPublicEnv } from "./lib/environment/env.common";
import { APP_DESCRIPTION, APP_NAME } from "./resources/app-config";
import { GeneralErrorBoundary } from "./components/error-boundary";

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
	{ rel: "stylesheet", href: globalStyleSheet },
];

export const meta: Route.MetaFunction = () => {
	return [
		{ title: APP_NAME },
		{ name: 'description', content: APP_DESCRIPTION },
	]
}

export async function loader({}: Route.LoaderArgs) {
	return data({
		publicEnv: getPublicEnv(import.meta.env),
	});
}

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	const loaderData = useLoaderData<typeof loader>();

	return <Outlet />;
}

export const ErrorBoundary = GeneralErrorBoundary;