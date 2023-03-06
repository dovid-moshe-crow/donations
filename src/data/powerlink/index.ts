/* eslint-disable */

import axios from "axios";



async function ambassadors(
  campaignId: string,
  ambsId?: string
): Promise<Array<{ value: string; label: string }>> {
  try {
    console.log(
      `(pcfsystemfield326 = ${campaignId})${
        ambsId ? " and \n(customobject1020id = " + ambsId : ")"
      })`
    );
    const result = await axios.post(
      "https://api.powerlink.co.il/api/query",
      {
        objecttype: "1020",
        sort_type: "desc",
        fields: "name,pcfsystemfield326,customobject1020id",
        query: `(pcfsystemfield326 = ${campaignId})${
          ambsId ? " AND (customobject1020id = " + ambsId : ")"
        })`,
      },
      {
        headers: {
          "Content-type": "application/json",
          tokenId: process.env.POWERLINK_TOKEN_ID,
        },
        timeout: 4000,
      }
    );

    return result.data["data"]["Data"].map((x: Record<string, string>) => {
      return {
        value: x["customobject1020id"],
        label: x["name"] ?? "",
      };
    });
  } catch {
    return [];
  }
}

export default { ambassadors };
