/* eslint-disable */

import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const ambassadorsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.ambassador.findMany({
        where: { campaignId: input.id },
      });
    }),
});
