/* eslint-disable */

import {
  Stack,
  TextInput,
  Checkbox,
  Textarea,
  Button,
  Text,
  Select,
} from "@mantine/core";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AmbSelect from "~/components/AmbSelect";
import Amount from "~/components/Amount";
import MultiSub from "~/components/MultiSub";

const NedarimCreditPage: NextPage = () => {
  const router = useRouter();
  const { Mosad1, Mosad2, Multiplier, id, amb } = router.query;

  const campaignId =
    typeof id === "string" ? id : "177b5cd5-2a69-4933-992e-1dd3599eb77e";
  const ambId = typeof amb === "string" ? amb : undefined;
  const multiplier = parseInt(typeof Multiplier == "string" ? Multiplier : "1");

  let paymentOptions: Record<string, { mosadId: string; apiValid: string }> =
    {};

  if (typeof Mosad1 == "string") {
    const mosad1 = Mosad1.split(",");
    paymentOptions[mosad1[0]!] = {
      apiValid: mosad1[1]!,
      mosadId: mosad1[2]!,
    };
  }

  if (typeof Mosad2 == "string") {
    const mosad2 = Mosad2.split(",");
    paymentOptions[mosad2[0]!] = {
      apiValid: mosad2[1]!,
      mosadId: mosad2[2]!,
    };
  }

  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    const readPostMessage = (e: MessageEvent<any>) => {
      if (e.data.Name == "TransactionResponse") {
        console.log(e);
        if (e.data.Value.Status == "Error") {
          setErrorMessage(e.data.Value.Message);
        } else {
          window.location.href = "https://yeshivatcy.co.il/";
        }
      }
    };
    window.addEventListener("message", readPostMessage, false);

    return () => {
      window.removeEventListener("message", readPostMessage);
    };
  });

  const onSubmitEv = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
          Param1: `${formProps.anonymous == "on"},${
            ambId ?? formProps.amb
          },${multiplier}`,
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
        <Stack>
          <AmbSelect campaignId={campaignId} ambassadorId={ambId} />
          <TextInput name="full_name" required label="שם מלא" />
          <TextInput name="email" type="email" label="דואר אלקטרוני" />
          <TextInput name="phone" type="tel" label="טלפון נייד" />
          <TextInput name="address" type="text" label="כתובת" />
          <TextInput name="city" type="text" label="עיר" />
          <Checkbox label="תרומה אנונימית" name="anonymous" />
          <Textarea name="dedication" label="הקדשה" />
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
            multiplier={multiplier}
            currencyFrom={["USD", "ILS"]}
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
