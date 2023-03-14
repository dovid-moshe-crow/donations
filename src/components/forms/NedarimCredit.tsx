/* eslint-disable */

import { Stack, LoadingOverlay, Text, Select, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import AmbSelect from "../AmbSelect";
import Amount from "../Amount";
import LoadingScreen from "../LoadingScreen";
import PersonalInfo from "../PersonaInfo";

const NedarimCredit = ({
  campaignId,
  ambId,
  lang,
}: {
  campaignId: string;
  ambId?: string;
  lang: "he" | "en";
}) => {
  const [visible, { close, open }] = useDisclosure(false);
  const [errorMessage, setErrorMessage] = useState("");
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
    return <LoadingScreen />;
  }

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
    <form
      dir={lang == "he" ? "rtl" : "ltr"}
      id="donation-form"
      onSubmit={onSubmitEv}
      className="p-6"
    >
      <Stack pos="relative">
        <LoadingOverlay visible={visible} overlayBlur={2} />
        <PersonalInfo fullNameRequired lang={lang} />
        <AmbSelect campaignId={campaignId} ambassadorId={ambId} lang={lang} />

        <Select
          label={t[lang].cardType}
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
          multiplier={parseInt(data["multiplier"])}
          currencyFrom={["ILS", "USD"]}
          currencyTo="ILS"
          noLimitValue=""
          sub
          subName="payments"
          lang={lang}
        />

        <Text color="red">{errorMessage}</Text>
        <Button type="submit">{t[lang].payAction}</Button>
      </Stack>
    </form>
  );
};

const t = {
  he: {
    cardType: "סוג כרטיס",
    payAction: "תרום",
  },
  en: {
    cardType: "Card Type",
    payAction: "Donate",
  },
} as const;

export default NedarimCredit;
