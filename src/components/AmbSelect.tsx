/* eslint-disable */
import { TextInput, Select } from "@mantine/core";
import React from "react";
import { api } from "~/utils/api";

function AmbSelect({
  campaignId,
  ambassadorId,
}: {
  campaignId: string;
  ambassadorId?: string;
}) {
  const { data, isLoading, isError } = api.powerlink.ambassadors.useQuery({
    campaignId,
    ambassadorId,
  });

  if (isLoading || isError) return <div></div>;

  console.log(data)

  return (
    <>
      <TextInput type="hidden" name="campaign" value={campaignId} />
      {ambassadorId ? (
        <>
          <TextInput name="amb" value={data[0]?.label} readOnly />
        </>
      ) : (
        <Select label="שגריר" searchable data={data} name="amb" />
      )}
    </>
  );
}

export default AmbSelect;
