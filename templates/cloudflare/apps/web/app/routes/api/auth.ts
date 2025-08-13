import type { ActionFunctionArgs, AppLoadContext, LoaderFunctionArgs } from "react-router";

export async function loader(args: LoaderFunctionArgs) {
	const request = args.request;
	const ctx = args.context as AppLoadContext;

	const auth = ctx.auth;

	return auth.handler(request);
}

export async function action(args: ActionFunctionArgs) {
	const request = args.request;
	const ctx = args.context as AppLoadContext;

	const auth = ctx.auth;

	return auth.handler(request);
}
