import { createTRPCClientInstance } from "@org/trpc/client";

export const trpc = createTRPCClientInstance("http://localhost:8080");
