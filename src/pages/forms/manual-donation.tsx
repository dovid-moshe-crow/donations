/* eslint-disable */

import { Box, LoadingOverlay, Stack, TextInput } from "@mantine/core";

import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Amount from "~/components/Amount";
import { api } from "~/utils/api";

const ManualDonationPage: NextPage = () => {
  const router = useRouter();
  const { id, amb } = router.query;

  const campaignId =
    typeof id === "string" ? id : "177b5cd5-2a69-4933-992e-1dd3599eb77e";
  const ambId = typeof amb === "string" ? amb : undefined;

  const { data } = api.campaignsExcel.getById.useQuery(campaignId);

  if (!data) {
    return (
      <Box pos="relative">
        <LoadingOverlay visible={true} overlayBlur={2} />
      </Box>
    );
  }

  return (
    <form dir="rtl" id="donation-form" className="p-6" >
      <Stack>
        <TextInput name="name" label="שם" />
        <Amount
          currencyFrom={["ILS", "USD"]}
          currencyTo="ILS"
          multiplier={parseInt(data["multiplier"])}
          label="סכום"
          sub={false}

        />
      </Stack>
    </form>
  );
};

export default ManualDonationPage;
