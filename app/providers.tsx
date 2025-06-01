import React from "react";

import { Toaster } from "~/components/ui/sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<>
			<main className="flex min-h-screen items-center justify-center">{children}</main>
			<Toaster />
		</>
	);
}
