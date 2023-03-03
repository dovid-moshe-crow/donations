/* eslint-disable */
import { TextInput, Select, Checkbox } from "@mantine/core";
import React, { useState } from "react";

function MultiSub({
  noLimitValue,
  name,
}: {
  noLimitValue: string;
  name: string;
}) {
  const [multiSub, setMultiSub] = useState(false);

  return (
    <>
      <Checkbox
        label="תרומה חוזרת"
        defaultChecked={multiSub}
        checked={multiSub}
        onChange={() => setMultiSub((prev) => !prev)}
      />

      {multiSub ? (
        <Select
          name={name}
          label="מספר תרומות"
          defaultValue="12"
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
