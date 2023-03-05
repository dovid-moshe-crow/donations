import { GoogleSpreadsheet } from "google-spreadsheet";

async function getDoc(sheetId: string | undefined) {
  const doc = new GoogleSpreadsheet(sheetId);
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
    private_key: process.env
      .GOOGLE_PRIVATE_KEY!.split(String.raw`\n`)
      .join("\n"),
  });
  return doc;
}

async function getFields<T extends readonly string[]>(doc: GoogleSpreadsheet, sheetName: string,keys: T) {
  await doc.loadInfo();

  const rows = await doc.sheetsByTitle[sheetName]?.getRows();

  if (!rows) {
    return [];
  }

  

  const arr = [];

  

  for(const row of rows){
    const e: Record<string,string> = {};
    for(const x of keys){
      e[x] = row[x];
    }

    arr.push(e);
  }

 


   console.log(arr)


  return arr as { [K in T[number]]: string }[];
}

export default { getDoc,getFields };
