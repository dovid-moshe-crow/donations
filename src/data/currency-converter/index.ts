/* eslint-disable */

import { load } from "cheerio";
import axios from "axios";
import Cache from "~/utils/cache";

console.log("restart page");

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
    EUR: "EUR 🇪🇺",
  };

  return currencyFlagMappings[currencyCode] ?? "";
}

function getCurrencySymbol(currencyCode: string): string {
  const currencySymbolMappings: { [key: string]: string } = {
    USD: "$",
    ILS: "₪",
    EUR: "€",
  };

  return currencySymbolMappings[currencyCode] ?? "";
}
export type CurrencyCode = (typeof currencyCode)[number];

const cache = new Cache<
  string,
  Map<CurrencyCode, { rate: number; flag: string; symbol: string }>
>(12 * 60 * 60);

export async function rates<
  Tto extends CurrencyCode,
  Tfrom extends CurrencyCode[]
>(to: Tto, from: Tfrom) {
  //console.log(cache.has(`${to}-${from.join(",")}`))

  const value = await cache.get(`${to}-${from.join(",")}`);

  if (value) {
    return value;
  }

  // if (cache.has(`${to}-${from.join(",")}`)) {
  //   return cache.get(`${to}-${from.join(",")}`)! as Map<
  //     Tfrom[number],
  //     { rate: number; flag: string; symbol: string }
  //   >;
  // }

  const rateList: Map<
    Tfrom[number],
    { rate: number; flag: string; symbol: string }
  > = new Map();

  const data = (
    await (
      await axios.get(
        `https://api.freecurrencyapi.com/v1/latest?apikey=${
          process.env.CURRENCY_API
        }&base_currency=${to}&currencies=${from.join(",")}`
      )
    ).data
  ).data as Record<string, number>;

  // for(const x in data){
  //   console.log(x)
  //   rateList.set(to, {
  //     rate: data[x]!,
  //     flag: getCurrencyFlag(x),
  //     symbol: getCurrencySymbol(x),
  //   });
  // }

  for (const x of from) {
    rateList.set(x, {
      rate: data[x]!,
      flag: getCurrencyFlag(x),
      symbol: getCurrencySymbol(x),
    });
  }

  // for (const x of from) {
  //   if (to == x) {
  //     rateList.set(x, {
  //       rate: 1,
  //       flag: getCurrencyFlag(x),
  //       symbol: getCurrencySymbol(x),
  //     });

  //     continue;
  //   }
  //   const html = await (
  //     await axios.get(`https://api.freecurrencyapi.com/v1/latest?apikey=${process.env.CURRENCY_API}&base_currency=${to}&currencies=${from.join(",")}`)
  //   ).data;

  //   rateList.set(x, {
  //     rate: parseFloat(load(html)(".iBp4i").text().split(" ")[0] ?? ""),
  //     flag: getCurrencyFlag(x),
  //     symbol: getCurrencySymbol(x),
  //   });
  // }

  cache.set(`${to}-${from.join(",")}`, rateList);

  console.log("new");

  return rateList;
}
