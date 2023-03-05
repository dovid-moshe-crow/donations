/* eslint-disable */

import { z } from "zod";
import powerlink from "~/data/powerlink";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const powerlinkRouter = createTRPCRouter({
  ambassadors: publicProcedure
    .input(
      z.object({
        campaignId: z
          .string()
          .optional()
          .default("177b5cd5-2a69-4933-992e-1dd3599eb77e"),
        ambassadorId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      return await powerlink.ambassadors(input.campaignId, input.ambassadorId);
    }),

    // createDonation: publicProcedure
    //     .input(z.object(
    
    //     ))
});
