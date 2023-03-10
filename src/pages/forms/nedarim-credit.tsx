/* eslint-disable */

import {
  Stack,
  TextInput,
  Checkbox,
  Textarea,
  Button,
  Text,
  Select,
  LoadingOverlay,
  Box,
} from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";
import { InferGetServerSidePropsType, NextApiResponse, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import AmbSelect from "~/components/AmbSelect";
import Amount from "~/components/Amount";
import { api } from "~/utils/api";

export const getServerSideProps = async ({
    query,
  }: {
    res: NextApiResponse;
    query: Record<string, string>;
  }) => {
    return { props: { query } };
  };

const NedarimCreditPage = ({
    query,
  }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [visible, { close, open }] = useDisclosure(false);
  const [errorMessage, setErrorMessage] = useState();

  const { id, amb } = query;

  const campaignId =
    typeof id === "string" ? id : "177b5cd5-2a69-4933-992e-1dd3599eb77e";
  const ambId = typeof amb === "string" ? amb : undefined;

  const { data } = api.campaignsExcel.getById.useQuery(campaignId);

  useEffect(() => {
    const readPostMessage = (e: MessageEvent<any>) => {
      if (e.data.Name == "TransactionResponse") {
        console.log(e);
        if (e.data.Value.Status == "Error") {
          close();
          setErrorMessage(e.data.Value.Message);
        } else {
          window.top!.location.href = "https://yeshivatcy.co.il/";
        }
      }
    };
    window.addEventListener("message", readPostMessage, false);

    return () => {
      window.removeEventListener("message", readPostMessage);
    };
  });

  if (!data) {
    return (
      <Box pos="relative">
        <LoadingOverlay visible={true} overlayBlur={2} />
      </Box>
    );
  }

  //const multiplier = parseInt(typeof Multiplier == "string" ? Multiplier : "1");

  let paymentOptions: Record<string, { mosadId: string; apiValid: string }> =
    {};

  if (data["mosad1 id"]) {
    paymentOptions[data["mosad1 name"]] = {
      apiValid: data["mosad1 apiValid"],
      mosadId: data["mosad1 id"],
    };
  }
  if (data["mosad2 id"]) {
    paymentOptions[data["mosad2 name"]] = {
      apiValid: data["mosad2 apiValid"],
      mosadId: data["mosad2 id"],
    };
  }

  const onSubmitEv = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    open();

    var formData = new FormData(e.target as any);
    const formProps = Object.fromEntries(formData);

    const nedarim = (document.getElementById("nedarim") as HTMLIFrameElement)
      .contentWindow;

    if (!nedarim) return;

    nedarim.postMessage(
      {
        Name: "FinishTransaction2",
        Value: {
          Mosad: paymentOptions[formProps.card_type?.toString() ?? ""]?.mosadId,
          ApiValid:
            paymentOptions[formProps.card_type?.toString() ?? ""]?.apiValid,
          Param2: formProps.dedication,
          Street: formProps.address,
          FirstName: formProps.full_name,
          City: formProps.city,
          Mail: formProps.email,
          Phone: formProps.phone,
          Param1: `${formProps.anonymous == "on"},${data["multiplier"]},${
            ambId ?? formProps.amb
          }`,
          Comment: `${campaignId}`,
          Tashlumim: formProps.payments == "0" ? "" : formProps.payments,
          Amount: formProps.amount,
          Currency: 1,
          PaymentType: formProps.payments == "1" ? "Ragil" : "HK",
          Zeout: "",
          LastName: "",
          Groupe: "",
          ForceUpdateMatching: "1",
        },
      },
      "*"
    );
  };

  return (
    <>
      <Head>
        <title>Bit</title>
        <meta name="description" content="Bit Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <form dir="rtl" id="donation-form" onSubmit={onSubmitEv} className="p-6">
        <Stack pos="relative">
          <LoadingOverlay visible={visible} overlayBlur={2} />
          <TextInput name="full_name" required label="שם מלא" />
          <TextInput name="email" type="email" label="דואר אלקטרוני" />
          <TextInput name="phone" type="tel" label="טלפון נייד" />
          <TextInput name="address" type="text" label="כתובת" />
          <TextInput name="city" type="text" label="עיר" />
          <Checkbox label="תרומה אנונימית" name="anonymous" />
          <Textarea name="dedication" label="הקדשה" />
          <AmbSelect campaignId={campaignId} ambassadorId={ambId} />
          <Select
            label="סוג כרטיס"
            defaultValue={Object.keys(paymentOptions)[0]}
            data={Object.keys(paymentOptions)}
            name="card_type"
          />

          <iframe
            src={`https://www.matara.pro/nedarimplus/iframe/`}
            height={320}
            id="nedarim"
          ></iframe>

          <Amount
            label="סכום"
            multiplier={parseInt(data["multiplier"])}
            currencyFrom={["ILS", "USD"]}
            currencyTo="ILS"
            noLimitValue=""
            sub
            subName="payments"
          />

          <Text color="red">{errorMessage}</Text>
          <Button type="submit">תרום</Button>
        </Stack>
      </form>
    </>
  );
};

export default NedarimCreditPage;
