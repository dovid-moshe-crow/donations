import { createTRPCRouter } from "~/server/api/trpc";
import { ambassadorsRouter } from "~/server/api/routers/ambassadors";
import { powerlinkRouter } from "./routers/powerlink";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  powerlink: powerlinkRouter,
  ambassadors: ambassadorsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
