/* eslint-disable */

import { z } from "zod";
import { rates, currencyCode } from "~/data/currency-converter";
import query from "~/data/powerlink/query";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const donationRouter = createTRPCRouter({
    rates: publicProcedure
        .input(
            z.object({
                campaignId: z.string(),
            })
        )
        .query(async ({ input }) => {
            // query({
            //     objecttype: ""
            // })
        }),
});
