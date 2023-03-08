/* eslint-disable */

import { z } from "zod";
import powerlink from "~/data/powerlink";
import { createRow } from "~/data/powerlink/create";

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

  recordDonation: publicProcedure
    .input(
      z.object({
        name: z.string(),
        displayName: z.string(),
        email: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        amount: z.number(),
        dedication: z.string().optional(),
        fundraiserEmail: z.string().optional(),
        fundraiserPhone: z.string().optional(),
        fundraiserName: z.string().optional(),
        collectionMethod: z.string().optional(),
        campaignId: z.string(),
        comments: z.string().optional(),
        currency: z
          .string()
          .optional()
          .transform((x) => {
            switch (x) {
              case "ILS":
                return "1";
              case "USD":
                return "2";
              case "EUR":
                return "3";
              default:
                return undefined;
            }
          }),
      })
    )
    .mutation(async ({ input }) => {
      console.log("mutate")

      const data = await createRow("1009", {
        name: input.name,
        pcfsyMAIL: input.email,
        pcfsADRESS: input.address,
        pcfsyPHONE: input.phone,
        pcfsystemfield141: input.campaignId,
        pcfsystemfield290: input.dedication,
        pcfsystemfield483: input.currency,
        pcfsystemfield139: input.amount.toString(),
        pcfsystemfield288: input.displayName,
        pcfsystemfield493: input.collectionMethod,
        pcfsystemfield487: input.fundraiserName,
        pcfsystemfield491: input.fundraiserEmail,
        pcfsystemfield489: input.fundraiserPhone,
        pcfsystemfield199: input.comments,
      });
      
      console.log(data)
    }),

  // createDonation: publicProcedure
  //     .input(z.object(

  //     ))
});
