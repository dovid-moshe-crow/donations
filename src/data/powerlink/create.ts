import axios from "axios";

async function createRow(objectType: string, object: Record<string, string>) {
  return (
    await axios.post(
      `https://api.powerlink.co.il/api/record/${objectType}`,
      object
    )
  ).data;
}
