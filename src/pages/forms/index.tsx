/* eslint-disable */

import { Stack } from "@mantine/core";
import { InferGetServerSidePropsType, NextApiResponse } from "next";
import CombinedForms from "~/components/forms/CombinedForms";
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
    const { id, amb } = query;

    const campaignId =
    typeof id === "string" ? id : "177b5cd5-2a69-4933-992e-1dd3599eb77e";
  const ambId = typeof amb === "string" ? amb : undefined;

    return <Stack>
        <LangToggle />
        <CombinedForms lang={lang} campaignId={campaignId} ambId={ambId} />
    </Stack>
  }


  export default FormsPage;