/* eslint-disable */

import axios from "axios";

export async function createRow(
  objectType: string,
  object: Record<string, string | undefined>
) {
  const res = await axios.post(
    `https://api.powerlink.co.il/api/record/${objectType}`,
    object,
    {
      headers: {
        "Content-type": "application/json",
        tokenId: process.env.POWERLINK_TOKEN_ID,
      },
      timeout: 6000,
    }
  );

  return res.data["data"]["Record"] as Record<string,string>;
}
