/* eslint-disable */

import {
  Stack,
  LoadingOverlay,
  TextInput,
  Checkbox,
  Textarea,
  Button,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { api } from "~/utils/api";
import AmbSelect from "../AmbSelect";
import Amount from "../Amount";
import LoadingScreen from "../LoadingScreen";
import PersonalInfo from "../PersonaInfo";

const StripeForm = ({
  campaignId,
  ambId,
  lang,
}: {
  campaignId: string;
  ambId?: string;
  lang: "he" | "en";
}) => {
  const [visible, { close, open }] = useDisclosure(false);
  const { data } = api.campaignsExcel.getById.useQuery(campaignId);

  if (!data) {
    return <LoadingScreen />;
  }

  return (
    <form
      dir={lang == "he" ? "rtl" : "ltr"}
      id="donation-form"
      action="/api/stripe/create-checkout"
      method="post"
      className="p-6"
      onSubmit={() => open()}
    >
      <Stack pos="relative">
        <LoadingOverlay visible={visible} overlayBlur={2} />
        <TextInput type="hidden" value={data["multiplier"]} name="multiplier" />

        <PersonalInfo lang={lang} fullNameRequired />

        <AmbSelect campaignId={campaignId} ambassadorId={ambId} lang={lang} />
        <Amount
          lang={lang}
          multiplier={parseInt(data["multiplier"])}
          currencyFrom={["USD", "ILS"]}
          currencyTo="USD"
          noLimitValue="0"
          sub
          subName="months"
        />
        <Button type="submit">תרום</Button>
      </Stack>
    </form>
  );
};

export default StripeForm;
