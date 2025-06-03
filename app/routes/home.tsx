import { auth } from "~/lib/auth/auth.server";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
	return [{ title: "New React Router App" }, { name: "description", content: "Welcome to React Router!" }];
}

export async function loader({ request }: Route.LoaderArgs) {
	const session = await auth.api.getSession(request);
	console.log("Loader called for home route", session);

	return new Response(`Welcome to React Router! Request URL: ${request.url}`);
}

export default function Home() {
	return (
		<section className="flex items-center justify-center">
			<h1 className="text-center text-4xl font-bold">Welcome to App</h1>
		</section>
	);
}
