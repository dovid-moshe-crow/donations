/* eslint-disable */

import { z } from "zod";
import { rates } from "~/data/currency-converter";
import powerlink from "~/data/powerlink";
import { createRow } from "~/data/powerlink/create";
import query from "~/data/powerlink/query";

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
              case "USD":
                return "1";
              case "ILS":
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
      const r = await rates("USD", ["ILS"]);

      // find donor

      const donors = await query({
        objecttype: 1005,
        fields: "customobject1005id",
        page_size: 100,
        sort_type: "desc",
        query: new Map().set("pcfsystemfield190", input.name),
      });

      console.log("mutate");

      let donorId: string | undefined;

      if (donors && donors.length > 0) {
        donorId = donors[0]!["customobject1005id"];
      } else {
        const donor = await createRow("1005", {
          pcfsystemfield190: input.name,
          pcfsystemfield94: input.email,
          pcfsystemfield124: input.address,
          pcfsystemfield92: input.phone,
          pcfsystemfield383: "1",
        });

        donorId = donor["customobject1005id"];
      }

      const data = await createRow("1009", {
        name: input.name,
        pcfsystemfield137: donorId,
        pcfsyMAIL: input.email,
        pcfsADRESS: input.address,
        pcfsyPHONE: input.phone,
        pcfsystemfield141: input.campaignId,
        pcfsystemfield290: input.dedication,
        pcfsystemfield483: input.currency,
        pcfsystemfield139: input.amount.toString(),
        pcfsUSD: (input.amount * r.get("ILS")!.rate).toString(),
        pcfsystemfield288: input.displayName,
        pcfsystemfield337: "8",
        pcfsystemfield493: input.collectionMethod,
        pcfsystemfield487: input.fundraiserName,
        pcfsystemfield491: input.fundraiserEmail,
        pcfsystemfield489: input.fundraiserPhone,
        pcfsystemfield199: input.comments,
      });

      return {
        name: data["name"],
        amount: data["pcfsystemfield139"],
      };
    }),

  // createDonation: publicProcedure
  //     .input(z.object(

  //     ))
});
