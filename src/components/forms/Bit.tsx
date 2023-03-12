/* eslint-disable */

import {
  Stack,
  LoadingOverlay,
  TextInput,
  Checkbox,
  Textarea,
  Button,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { api } from "~/utils/api";

import AmbSelect from "../AmbSelect";
import Amount from "../Amount";
import LoadingScreen from "../LoadingScreen";
import PersonalInfo from "../PersonaInfo";

const BitForm = ({
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

  if (!data) {
    return <LoadingScreen />;
  }

  const onSubmitEv = async (e: React.FormEvent<HTMLFormElement>) => {
    open();
    e.preventDefault();

    var formData = new FormData(e.target as any);
    const formProps = Object.fromEntries(formData);

    const res = await fetch(
      "https://www.matara.pro/nedarimplus/V6/Files/WebServices/DebitBit.aspx?Action=CreateTransaction",
      {
        method: "POST",
        body: new URLSearchParams({
          ApiValid: data["mosad1 apiValid"],
          MosadId: data["mosad1 id"],
          ClientName: formProps.full_name?.toString() ?? "",
          Adresse: formProps.address?.toString() ?? "",
          Phone: formProps.phone?.toString() ?? "",
          Amount: formProps.amount?.toString() ?? "",
          Mail: formProps.email?.toString() ?? "",
          Tashlumim: "1",
          Currency: "1",
          Comment: JSON.stringify({
            anonymous: formProps.anonymous == "on",
            campaignId: campaignId ?? "",
            amb: formProps.amb ?? "",
            dedication: formProps.dedication ?? "",
            mulitplier: data["multiplier"],
          }),
        }),
      }
    );

    const json = await res.json();

    if (json.Status === "OK") {
      window.top!.location = json.Message;
    } else {
      close();
      setErrorMessage(json.Message);
    }
  };

  return (
    <form dir={lang=="he" ? "rtl" : "ltr"} id="donation-form" onSubmit={onSubmitEv} className="p-6">
      <Stack pos="relative">
        <LoadingOverlay visible={visible} overlayBlur={2} />
        <PersonalInfo lang={lang} fullNameRequired phoneRequired />
        <AmbSelect campaignId={campaignId} ambassadorId={ambId} lang={lang} />
        <Amount
          lang={lang}
          multiplier={parseInt(data["multiplier"])}
          currencyFrom={["ILS", "USD"]}
          currencyTo="ILS"
          sub={false}
        />
        <Text color="red">{errorMessage}</Text>
        <Button type="submit">תרום</Button>
      </Stack>
    </form>
  );
};

export default BitForm;
