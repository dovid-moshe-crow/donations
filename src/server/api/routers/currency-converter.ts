/* eslint-disable */

import { z } from "zod";
import {rates,currencyCode} from "~/data/currency-converter";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const currencyConverterRouter = createTRPCRouter({
  rates: publicProcedure
    .input(
      z.object({
        from: z.array(z.enum(currencyCode)),
        to: z.enum(currencyCode)
      })
    )
    .query(async ({ input }) => {
      return await rates(input.to, input.from)
    }),
});
