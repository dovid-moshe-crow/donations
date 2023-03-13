import { createTRPCRouter } from "~/server/api/trpc";
import { ambassadorsRouter } from "~/server/api/routers/ambassadors";
import { powerlinkRouter } from "./routers/powerlink";
import { currencyConverterRouter } from "./routers/currency-converter";
import { campaignsExcelRouter } from "./routers/campaigns-excel";
import { donationRouter } from "./routers/donations";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  powerlink: powerlinkRouter,
  ambassadors: ambassadorsRouter,
  currencyConverter: currencyConverterRouter,
  campaignsExcel: campaignsExcelRouter,
  donations: donationRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
