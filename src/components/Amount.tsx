/* eslint-disable */

import React, { useState } from "react";
import { NativeSelect, TextInput, Text } from "@mantine/core";

function Amount({ label, multiplier }: { label: string; multiplier: number }) {
  const [amount, setAmount] = useState(1);
  const [currency, setCurrency] = useState("usd");
  const data = [
    { value: "usd", label: "🇺🇸 USD" },
    { value: "ils", label: "🇮🇱 ILS" },
  ];
  const select = (
    <NativeSelect
      name="currency"
      w={90}
      value={currency}
      onChange={(e) => setCurrency(e.target.value)}
      data={data}
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
    <div className="m-0 p-0">
      <TextInput
        className="w-full"
        type="number"
        min={1}
        required
        name="amount"
        value={amount}
        onChange={(e) => setAmount(parseInt(e.target.value))}
        label={label}
        rightSection={select}
        rightSectionWidth={90}
        mb={0}
      />
      <Text color={"dimmed"}>
        X{multiplier}: {multiplier * amount}
      </Text>
    </div>
  );
}

export default Amount;
