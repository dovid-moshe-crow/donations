/* eslint-disable */

import axios from "axios";

type PowerlinkParams = {
  objecttype: number;
  sort_type: "desc" | "asc";
  page_size: number;
  fields?: string;
  query?: Map<string, string>;
};

async function query(params: PowerlinkParams) {
  let queryString: string | undefined = undefined;

  if (params.query) {
    queryString = "";
    let first = true;
    for (const [key, value] of params.query) {
      if (first) {
        queryString += `(${key} = ${value})`;
        first = false;
      } else {
        queryString += ` AND (${key} = ${value})`;
      }
    }
  }

  const result = await axios.post(
    "https://api.powerlink.co.il/api/query",
    {
      objecttype: params.objecttype.toString(),
      sort_type: params.sort_type,
      page_size: params.page_size.toString(),
      fields: !params.fields ? undefined : params.fields,
      query: queryString,
    },
    {
      headers: {
        "Content-type": "application/json",
        tokenId: process.env.POWERLINK_TOKEN_ID,
      },
      timeout: 4000,
    }
  );

  return result.data["data"]["Data"];
}

export default {};
