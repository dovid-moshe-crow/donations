/* eslint-disable */

import { Group, Stack } from "@mantine/core";
import {} from "@mantine/core";
import { InferGetServerSidePropsType, NextApiResponse } from "next";
import BitForm from "~/components/forms/Bit";
import CombinedForms from "~/components/forms/CombinedForms";
import CreateAmb from "~/components/forms/CreateAmb";
import ManualDonation from "~/components/forms/ManualDonation";
import NedarimCredit from "~/components/forms/NedarimCredit";
import StripeForm from "~/components/forms/Stripe";
import { LangToggle } from "~/components/LangToggle";
import { useLang } from "~/context/lang";

export const getServerSideProps = async ({
  query,
}: {
  res: NextApiResponse;
  query: Record<string, string>;
}) => {
  return { props: { query } };
};

const FormsPage = ({
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { lang } = useLang();
  const { id, amb, form } = query;

  const campaignId =
    typeof id === "string" ? id : "177b5cd5-2a69-4933-992e-1dd3599eb77e";
  const ambId = typeof amb === "string" ? amb : undefined;

  return (
    <Stack>
      <LangToggle />
      <FormToShow
        campaignId={campaignId}
        ambId={ambId}
        lang={lang}
        form={form}
      />
    </Stack>
  );
};

const FormToShow = ({
  campaignId,
  lang,
  ambId,
  form,
}: {
  campaignId: string;
  ambId?: string;
  lang: "he" | "en";
  form: unknown;
}) => {
  switch (form) {
    case "bit":
      return <BitForm lang={lang} campaignId={campaignId} ambId={ambId} />;
    case "stripe":
      return <StripeForm lang={lang} campaignId={campaignId} ambId={ambId} />;
    case "nedarim-credit":
      return (
        <NedarimCredit lang={lang} campaignId={campaignId} ambId={ambId} />
      );
    case "manual-donation":
      return (
        <ManualDonation lang={lang} campaignId={campaignId} ambId={ambId} />
      );
    case "create-amb":
      return <CreateAmb campaignId={campaignId} lang={lang} />;
    default:
      return <div></div>;
  }
};

export default FormsPage;
