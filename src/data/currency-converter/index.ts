/* eslint-disable */

import { load } from "cheerio";
import axios from "axios";
import Cache from "~/utils/cache";

export const currencyCode = [
  "AFN",
  "ALL",
  "DZD",
  "AOA",
  "ARS",
  "AMD",
  "AWG",
  "AUD",
  "AZN",
  "BSD",
  "BHD",
  "BBD",
  "BDT",
  "BYN",
  "BZD",
  "BMD",
  "BTN",
  "XBT",
  "BOB",
  "BAM",
  "BWP",
  "BRL",
  "BND",
  "BGN",
  "BIF",
  "XPF",
  "KHR",
  "CAD",
  "CVE",
  "KYD",
  "FCFA",
  "CLP",
  "CLF",
  "CNY",
  "CNY",
  "COP",
  "CF",
  "CDF",
  "CRC",
  "HRK",
  "CUC",
  "CZK",
  "DKK",
  "DJF",
  "DOP",
  "XCD",
  "EGP",
  "ETB",
  "FJD",
  "GMD",
  "GBP",
  "GEL",
  "GHS",
  "GTQ",
  "GNF",
  "GYD",
  "HTG",
  "HNL",
  "HKD",
  "HUF",
  "ISK",
  "INR",
  "IDR",
  "IRR",
  "IQD",
  "ILS",
  "JMD",
  "JPY",
  "JOD",
  "KZT",
  "KES",
  "KWD",
  "KGS",
  "LAK",
  "LBP",
  "LSL",
  "LRD",
  "LYD",
  "MOP",
  "MKD",
  "MGA",
  "MWK",
  "MYR",
  "MVR",
  "MRO",
  "MUR",
  "MXN",
  "MDL",
  "MAD",
  "MZN",
  "MMK",
  "NAD",
  "NPR",
  "ANG",
  "NZD",
  "NIO",
  "NGN",
  "NOK",
  "OMR",
  "PKR",
  "PAB",
  "PGK",
  "PYG",
  "PHP",
  "PLN",
  "QAR",
  "RON",
  "RUB",
  "RWF",
  "SVC",
  "SAR",
  "RSD",
  "SCR",
  "SLL",
  "SGD",
  "SBD",
  "SOS",
  "ZAR",
  "KRW",
  "VES",
  "LKR",
  "SDG",
  "SRD",
  "SZL",
  "SEK",
  "CHF",
  "TJS",
  "TZS",
  "THB",
  "TOP",
  "TTD",
  "TND",
  "TRY",
  "TMT",
  "UGX",
  "UAH",
  "AED",
  "USD",
  "UYU",
  "UZS",
  "VND",
  "XOF",
  "YER",
  "ZMW",
  "ETH",
  "EUR",
  "LTC",
  "TWD",
  "PEN",
] as const;

function getCurrencyFlag(currencyCode: string): string {
  const currencyFlagMappings: { [key: string]: string } = {
    USD: "USD 🇺🇸",
    ILS: "ILS 🇮🇱",
  };

  return currencyFlagMappings[currencyCode] ?? "";
}
export type CurrencyCode = (typeof currencyCode)[number];


const cache = new Cache<
  CurrencyCode,
  Map<CurrencyCode, { rate: number; flag: string }>
>(5 * 60 * 1000);

export async function rates(to: CurrencyCode, from: CurrencyCode[]) {
  if (cache.has(to)) {
    return cache.get(to)!;
  }

  const rateList: Map<CurrencyCode, { rate: number; flag: string }> = new Map();

  for (const x of from) {
    if (to == x) {
      rateList.set(x, {
        rate: 1,
        flag: getCurrencyFlag(x),
      });

      continue;
    }
    const html = await (
      await axios.get(`https://www.google.com/search?q=${x}+to+${to}+&hl=en`)
    ).data;

    console.log(load(html)(".iBp4i").text());

    rateList.set(x, {
      rate: parseFloat(load(html)(".iBp4i").text().split(" ")[0] ?? ""),
      flag: getCurrencyFlag(x),
    });
  }

  cache.set(to, rateList);

  return rateList;
}
