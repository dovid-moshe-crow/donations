/* eslint-disable */

import { z } from "zod";
import excel from "~/data/excel";
import { createRow } from "~/data/powerlink/create";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const ambassadorsRouter = createTRPCRouter({
  createAmbassador: publicProcedure
    .input(
      z.object({
        campaignId: z.string(),
        nameTitle: z.string().optional(),
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().optional(),
        phone: z.string().optional(),
        target: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const data = await createRow("1020", {
        pcfsystemfield326: input.campaignId,
        pcfsTOHAR: input.nameTitle,
        pcfsFIRSTNAME: input.firstName,
        pcfFAMILY: input.lastName,
        pcfsMAIL: input.email,
        pcfPHONE: input.phone,
        pcfsystemfield331: input.target.toString(),
      });

      const doc = await excel.getDoc(process.env.CAMPAIGN_SHEET_ID);

      await excel.addRow({
        doc,
        sheetName: "שגרירים",
        values: {
          id: data["customobject1020id"] ?? "no id",
          campaignId: input.campaignId,
          nameTitle: input.nameTitle ?? "",
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email ?? "",
          phone: input.phone ?? "",
          target: input.target,
        },
      });

      return {
        name: `${data["pcfsTOHAR"]} ${data["pcfsFIRSTNAME"]} ${data["pcfFAMILY"]}`,
        target: data["pcfsystemfield331"],
      };
    }),
});
