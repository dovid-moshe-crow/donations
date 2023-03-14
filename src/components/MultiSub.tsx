/* eslint-disable */
import { TextInput, Select, Checkbox } from "@mantine/core";
import React, { useEffect, useState } from "react";

function MultiSub({
  noLimitValue = "",
  name,
  payments,
  setPayments,
  lang,
}: {
  noLimitValue?: string;
  name?: string;
  payments: string;
  setPayments: (x: string) => void;
  lang: "he" | "en";
}) {
  const [multiSub, setMultiSub] = useState(false);

  useEffect(() => {
    if (multiSub) {
      setPayments("12");
    } else {
      setPayments("1");
    }
  }, [multiSub]);

  return (
    <>
      <Checkbox
        dir={lang == "he" ? "rtl" : "ltr"}
        label={t[lang].recurringDonation}
        checked={multiSub}
        onChange={() => {
          setMultiSub((prev) => !prev);
        }}
      />

      {multiSub ? (
        <Select
          dir={lang == "he" ? "rtl" : "ltr"}
          name={name}
          label={t[lang].numberOfPayments}
          value={payments}
          onChange={(e) => setPayments(e ?? noLimitValue)}
          data={[
            { value: noLimitValue, label: t[lang].noLimit },
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

const t = {
  he: {
    recurringDonation: "תרומה חוזרת",
    numberOfPayments: "מספר תרומות",
    noLimit: "ללא הגבלה",
  },
  en: {
    recurringDonation: "Recurring Donation",
    numberOfPayments: "Number of Payments",
    noLimit: "No Limit",
  },
} as const;

export default MultiSub;
