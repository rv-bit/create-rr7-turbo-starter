import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function getErrorMessage(error: unknown) {
	if (typeof error === "string") return error;
	if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
		return error.message;
	}
	console.error("Unable to get error message for error", error);
	return "Unknown Error";
}

export function getBaseUrl() {
	if (typeof window !== "undefined") return window.location.origin;
	if (process.env.RAILWAY_PUBLIC_DOMAIN) return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
	return `http://localhost:${process.env.PORT ?? 3000}`;
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
