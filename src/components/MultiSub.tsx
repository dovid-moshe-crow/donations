/* eslint-disable */
import { TextInput, Select, Checkbox } from "@mantine/core";
import React, { useEffect, useState } from "react";

function MultiSub({
  noLimitValue = "",
  name,
  payments,
  setPayments,
}: {
  noLimitValue?: string;
  name?: string;
  payments: string;
  setPayments: (x: string) => void;
}) {
  const [multiSub, setMultiSub] = useState(false);

  useEffect(() => {
    if (multiSub) {
        setPayments("12");
      } else {
        setPayments("1");
      }
  },[multiSub])

  return (
    <>
      <Checkbox
        label="תרומה חוזרת"
        checked={multiSub}
        onChange={() => {
          setMultiSub((prev) => !prev);
        }}
      />

      {multiSub ? (
        <Select
          name={name}
          label="מספר תרומות"
          value={payments}
          onChange={(e) => setPayments(e ?? noLimitValue)}
          data={[
            { value: noLimitValue, label: "ללא הגבלה" },
            ...new Array(24)
              .fill(0)
              .map((_, i) => ({ label: `${i + 1}`, value: `${i + 1}` })),
          ]}
        />
      ) : (
        <TextInput type="hidden" name={name} value={1} />
      )}
    </>
  );
}

export default MultiSub;
