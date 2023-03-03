/* eslint-disable */

import React, { useEffect, useState } from "react";
import { NativeSelect, TextInput, Text, Checkbox, Select } from "@mantine/core";
import { api } from "~/utils/api";
import { CurrencyCode } from "~/data/currency-converter";
import MultiSub from "./MultiSub";

function Amount({
  label,
  multiplier,
  currencyTo,
  currencyFrom,
  sub = false,
  noLimitValue,
  subName,
}: {
  label: string;
  multiplier: number;
  currencyTo: CurrencyCode;
  currencyFrom: CurrencyCode[];
  sub: boolean;
  subName?: string;
  noLimitValue?: string;
}) {
  const { data } = api.currencyConverter.rates.useQuery({
    from: currencyFrom,
    to: currencyTo,
  });
  const [amount, setAmount] = useState(1);
  const [payments, setPayments] = useState("1");
  const [currency, setCurrency] = useState(currencyFrom[0]!);
  const [realAmount, setRealAmount] = useState(0);

  useEffect(() => {
    if (!data) return;
    setRealAmount(Math.floor(amount * data.get(currency)!.rate));
  }, [amount, currency]);

  if (!data) return <Text>Error</Text>;

  const countries: { value: string; label: string }[] = [];

  for (const x of data.entries()) {
    console.log(x);
    countries.push({ value: x[0], label: x[1].flag });
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
          min={1}
          required
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value))}
          label={label}
          rightSection={select}
          rightSectionWidth={90}
          mb={0}
        />
        {multiplier != 1 && (
          <Text color={"dimmed"}>
            X{multiplier}: {multiplier * amount}
          </Text>
        )}
        <Text color={"dimmed"}>
          תחויב ב- {currencyTo} {realAmount}
          {payments != "1" && payments != noLimitValue
            ? `ל-${payments} חודשים`
            : ""}{" "}
          {payments === noLimitValue ? "כל חודש" : ""}
        </Text>
      </div>
    </>
  );
}

export default Amount;
