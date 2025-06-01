import { Toaster as Sonner, type ToasterProps } from "sonner";
import useRootLoader from "~/hooks/useRootLoader";

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme: cookieTheme } = useRootLoader();

	const systemPreferenceDark = typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)").matches : false;
	const theme = cookieTheme === "system" ? (systemPreferenceDark ? "dark" : "light") : (cookieTheme ?? "light");

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group"
			style={
				{
					"--normal-bg": "var(--popover)",
					"--normal-text": "var(--popover-foreground)",
					"--normal-border": "var(--border)",
				} as React.CSSProperties
			}
			{...props}
		/>
	);
};

export { Toaster };
