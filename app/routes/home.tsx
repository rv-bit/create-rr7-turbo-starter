import type { Route } from "./+types/home";

import { useQuery } from "@tanstack/react-query";

import { auth } from "~/lib/auth/auth.server";
import { useTRPC } from "~/lib/trpc/react";

export function meta({}: Route.MetaArgs) {
	return [{ title: "New React Router App" }, { name: "description", content: "Welcome to React Router!" }];
}

export async function loader({ request }: Route.LoaderArgs) {
	const session = await auth.api.getSession(request);
	console.log("Loader called for home route", session);

	return new Response(`Welcome to React Router! Request URL: ${request.url}`);
}

export default function Home() {
	const trpc = useTRPC();
	const { data: hello } = useQuery(trpc.greeting.hello.queryOptions());

	return (
		<section className="flex items-center justify-center">
			<h1 className="text-center text-4xl font-bold">Welcome to App</h1>
		</section>
	);
}
