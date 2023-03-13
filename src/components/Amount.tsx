/* eslint-disable */

import React, { useEffect, useState } from "react";
import { NativeSelect, TextInput, Text, Checkbox, Select } from "@mantine/core";
import { api } from "~/utils/api";
import { CurrencyCode } from "~/data/currency-converter";
import MultiSub from "./MultiSub";

function Amount({
  multiplier,
  currencyTo,
  currencyFrom,
  sub = false,
  noLimitValue,
  subName,
  lang,
}: {
  multiplier: number;
  currencyTo: CurrencyCode;
  currencyFrom: CurrencyCode[];
  sub: boolean;
  subName?: string;
  noLimitValue?: string;
  lang: "he" | "en";
}) {
  const { data, isError, isLoading } = api.currencyConverter.rates.useQuery(
    {
      from: currencyFrom,
      to: currencyTo,
    },
    
  );

  const [currency, setCurrency] = useState(currencyFrom[0]!);
  const [minValue, setMinValue] = useState(0);
  const [amount, setAmount] = useState(0);
  const [payments, setPayments] = useState("1");

  const [realAmount, setRealAmount] = useState(1);

  useEffect(() => {
    if (!data) return;
    console.log(data.get(currency));
    setAmount(
      data.get(currency)!.rate > 1 ? Math.ceil(data.get(currency)!.rate) : 1
    );
    setRealAmount(Math.floor(amount / data.get(currency)!.rate));
    setMinValue(
      data.get(currency)!.rate > 1 ? Math.ceil(data.get(currency)!.rate) : 1
    );
  }, [isLoading]);

  useEffect(() => {
    if (!data) return;
    setRealAmount(Math.floor(amount / data.get(currency)!.rate));
  }, [amount, currency]);

  useEffect(() => {
    if (!data) return;
    setMinValue(
      data.get(currency)!.rate > 1 ? Math.ceil(data.get(currency)!.rate) : 1
    );
    if (amount < minValue) setAmount(minValue);
  }, [currency]);

  if (isLoading)
    return (
      <>
        {sub ?? <Checkbox label={t[lang].recurringDonation} />}
        <TextInput label={t[lang].amount} disabled></TextInput>
      </>
    );

  if (isError) return <Text color="red">Error</Text>;

  const countries: { value: string; label: string }[] = [];

  for (const x of data.entries()) {
    countries.push({ value: x[0], label: x[1].symbol });
  }

  const select = (
    <NativeSelect
      name="currency"
      w={90}
      value={currency}
      onChange={(e) => setCurrency(e.target.value as any)}
      data={countries}
      styles={{
        input: {
          fontWeight: 500,
          fontSize: 14,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        },
      }}
    />
  );

  return (
    <>
      {sub && (
        <MultiSub
          payments={payments}
          setPayments={setPayments}
          name={subName}
          noLimitValue={noLimitValue}
        />
      )}
      <div className="m-0 p-0">
        <TextInput type="hidden" name="amount" value={realAmount} />
        <TextInput
          className="w-full"
          type="number"
          min={minValue}
          required
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value))}
          label={t[lang].amount}
          rightSection={select}
          rightSectionWidth={90}
          mb={0}
        />
        {multiplier != 1 && (
          <Text color={"dimmed"}>
            {t[lang].doublingMessage(
              amount,
              multiplier,
              data.get(currency)!.symbol
            )}
          </Text>
        )}
        {currency != currencyTo && (
          <Text color={"dimmed"}>
            {t[lang].checkoutMessage(
              data.get(currencyTo)!.symbol,
              realAmount,
              payments,
              noLimitValue
            )}
          </Text>
        )}
      </div>
    </>
  );
}

const t = {
  he: {
    recurringDonation: "תרומה חוזרת",
    amount: "סכום",
    doublingMessage: (amount: number, multiplier: number, currency: string) =>
      `אתה תורם ${amount} ${currency} ואנחנו נקבל ${
        amount * multiplier
      } ${currency}`,
    checkoutMessage: (
      currencyTo: string,
      realAmount: number,
      payments: string,
      noLimitValue?: string
    ) => `תחויב ב- ${currencyTo} ${realAmount}${
      payments != "1" && payments != noLimitValue ? `ל-${payments} חודשים` : ""
    }
    ${payments === noLimitValue ? "כל חודש" : ""}`,
  },
  en: {
    recurringDonation: "Recurring Donation",
    amount: "Amount",
    doublingMessage: (amount: number, multiplier: number, currency: string) =>
      `You are donating ${amount} ${currency} and we will get ${
        amount * multiplier
      } ${currency}`,

    checkoutMessage: (
      currencyTo: string,
      realAmount: number,
      payments: string,
      noLimitValue?: string
    ) =>
      `You will be charged ${realAmount} ${currencyTo} ${
        payments != "1" && payments != noLimitValue
          ? `for ${payments} months`
          : ""
      }${payments === noLimitValue ? "every month" : ""}`,
  },
} as const;

export default Amount;
