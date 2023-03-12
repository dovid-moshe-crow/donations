/* eslint-disable */

import { InferGetServerSidePropsType, NextApiResponse } from "next";
import BitForm from "~/components/forms/Bit";
import CreateAmb from "~/components/forms/CreateAmb";
import ManualDonation from "~/components/forms/ManualDonation";
import NedarimCredit from "~/components/forms/NedarimCredit";
import StripeForm from "~/components/forms/Stripe";

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
  const { id, amb, form } = query;

  const campaignId =
    typeof id === "string" ? id : "177b5cd5-2a69-4933-992e-1dd3599eb77e";
  const ambId = typeof amb === "string" ? amb : undefined;

  const lang = "he";

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
      return <CreateAmb lang={lang} campaignId={campaignId} />;
    default:
      return <></>;
  }
};

export default FormsPage;