import { router } from "../server";

import { greetingRouter } from "./greeting";

export const appRouter = router({ greeting: greetingRouter });
export type AppRouter = typeof appRouter;
