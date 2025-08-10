import React from "react";

import { TRPCReactProvider } from "~/lib/trpc/react";

import Toaster from "~/components/ui/sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<TRPCReactProvider>
			<main className="flex min-h-screen items-center justify-center">{children}</main>
			<Toaster />
		</TRPCReactProvider>
	);
}
