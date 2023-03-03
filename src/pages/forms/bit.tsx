/* eslint-disable */

import {
  Stack,
  TextInput,
  Checkbox,
  Textarea,
  Button,
  Text,
} from "@mantine/core";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import AmbSelect from "~/components/AmbSelect";
import Amount from "~/components/Amount";
import MultiSub from "~/components/MultiSub";

const BitPage: NextPage = () => {
  const router = useRouter();
  const { Multiplier, id, amb, mosadId, apiValid } = router.query;

  const campaignId =
    typeof id === "string" ? id : "177b5cd5-2a69-4933-992e-1dd3599eb77e";
  const ambId = typeof amb === "string" ? amb : undefined;
  const multiplier = parseInt(typeof Multiplier == "string" ? Multiplier : "1");

  const [errorMessage, setErrorMessage] = useState("");

  const onSubmitEv = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    var formData = new FormData(e.target as any);
    const formProps = Object.fromEntries(formData);

    const res = await fetch(
      "https://www.matara.pro/nedarimplus/V6/Files/WebServices/DebitBit.aspx?Action=CreateTransaction",
      {
        method: "POST",
        body: new URLSearchParams({
          CallBack: "https://yeshivatcy.co.il/",
          ApiValid: apiValid as any,
          MosadId: mosadId as any,
          ClientName: formProps.full_name?.toString() ?? "",
          Adresse: formProps.address?.toString() ?? "",
          Phone: formProps.phone?.toString() ?? "",
          Amount: formProps.amount?.toString() ?? "",
          Mail: formProps.email?.toString() ?? "",
          Tashlumim: "1",
          Currency: "1",
          Comment: `~${formProps.anonymous == "on"}~${campaignId}~${
            formProps.amb
          }~${formProps.dedication}~${multiplier}`,
        }),
      }
    );

    const json = await res.json();

    if (json.Status === "OK") {
      window.location = json.Message;
    } else {
      setErrorMessage(json.Message);
    }
  };

  return (
    <>
      <Head>
        <title>Bit</title>
        <meta name="description" content="Bit Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <form dir="rtl" id="donation-form" onSubmit={onSubmitEv} className="p-6">
        <Stack>
          <AmbSelect campaignId={campaignId} ambassadorId={ambId} />
          <TextInput name="full_name" required label="שם מלא" />
          <TextInput name="email" type="email" label="דואר אלקטרוני" />
          <TextInput name="phone" type="tel" label="טלפון נייד" />
          <TextInput name="address" type="text" label="כתובת" />
          <TextInput name="city" type="text" label="עיר" />
          <Checkbox label="תרומה אנונימית" name="anonymous" />
          <Textarea name="dedication" label="הקדשה" />
          <Amount label="סכום" multiplier={multiplier} />
          <Text color="red">{errorMessage}</Text>
          <Button type="submit">תרום</Button>
        </Stack>
      </form>
    </>
  );
};

export default BitPage;
