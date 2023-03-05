/* eslint-disable */

import { GoogleSpreadsheet } from "google-spreadsheet";
import { z } from "zod";
import excel from "~/data/excel";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

type ExcelCampaign = {
  id: string;
  "mosad1 name": string;
  "mosad1 id": string;
  "mosad1 apiValid": string;
  "mosad2 name": string;
  "mosad2 id": string;
  "mosad2 apiValid": string;
  multiplier: string;
};

let doc: GoogleSpreadsheet = await excel.getDoc(process.env.CAMPAIGN_SHEET_ID);

// (async () => {
//   doc = ;
// })();

async function getCampaignFields() {
  console.log("hi" + doc)
  return await excel.getFields(doc, "גיליון1", [
    "id",
    "mosad1 name",
    "mosad1 id",
    "mosad1 apiValid",
    "mosad2 name",
    "mosad2 id",
    "mosad2 apiValid",
    "multiplier",
  ] as const);
}

export const campaignsExcelRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ input, ctx }) => {
    return await getCampaignFields();
  }),

  getById: publicProcedure.input(z.string()).query(async ({ input: id }) => {
    return (await getCampaignFields()).find((x) => x.id == id);
  }),
});