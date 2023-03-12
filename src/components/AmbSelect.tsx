/* eslint-disable */
import { TextInput, Select } from "@mantine/core";
import React from "react";
import { api } from "~/utils/api";

function AmbSelect({
  campaignId,
  ambassadorId,
  lang,
}: {
  campaignId: string;
  ambassadorId?: string;
  lang: "he" | "en";
}) {
  const { data, isLoading, isError } = api.powerlink.ambassadors.useQuery({
    campaignId,
    ambassadorId,
  });

  if (isLoading || isError || data.length == 0) return <div></div>;

  return (
    <>
      <TextInput type="hidden" name="campaign" value={campaignId} />
      {ambassadorId ? (
        <>
          <TextInput name="amb" value={data[0]?.label} readOnly />
        </>
      ) : (
        <Select label={t[lang].amb} searchable data={data} name="amb" />
      )}
    </>
  );
}

const t = {
  he: {
    amb: "שגריר",
  },

  en: {
    amb: "Ambassador",
  },
}as const;

export default AmbSelect;
