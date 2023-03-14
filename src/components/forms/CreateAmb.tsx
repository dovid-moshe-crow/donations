/* eslint-disable */

import {
  Stack,
  LoadingOverlay,
  Title,
  TextInput,
  NumberInput,
  Button,
  Card,
  Text,
  Group,
  Anchor,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { api } from "~/utils/api";
import LoadingScreen from "../LoadingScreen";

const CreateAmb = ({
  campaignId,
  lang,
}: {
  campaignId: string;
  lang: "he" | "en";
}) => {
  const [visible, { close, open }] = useDisclosure(false);

  const { data } = api.campaignsExcel.getById.useQuery(campaignId);

  const { data: createAmbResult, mutate } =
    api.ambassadors.createAmbassador.useMutation();

  if (!data) {
    return <LoadingScreen />;
  }

  if (createAmbResult) {
    return (
      <div className="flex h-screen items-center">
        <div className="container mx-auto flex items-center justify-center">
          <Card withBorder dir={lang == "he" ? "rtl" : "ltr"} w={600}>
            <Stack>
              <Title align="center">{t[lang].ambDetails}</Title>
              <Group>
                <Text color="blue" weight="bold">
                  {t[lang].name}
                </Text>
                <Text weight="bold">{createAmbResult.name}</Text>
              </Group>

              <Group>
                <Text color="blue" weight="bold">
                  {t[lang].target}
                </Text>
                <Text weight="bold">{createAmbResult.target}</Text>
              </Group>

              <Button onClick={() => window.location.reload()}>
                {t[lang].backToAmb}
              </Button>
              <Anchor href={`/landing/forms?id=${campaignId}`} align="center">
                {t[lang].backToMainPage}
              </Anchor>
              <Anchor
                href={`https://app.powerlink.co.il/app/record/1020/${createAmbResult.id}`}
                align="center"
              >
                {t[lang].goToCrm}
              </Anchor>
            </Stack>
          </Card>
        </div>
      </div>
    );
  }

  const onSubmitEv = async (e: React.FormEvent<HTMLFormElement>) => {
    open();
    e.preventDefault();

    var formData = new FormData(e.target as any);
    const formProps = Object.fromEntries(formData);

    mutate({
      campaignId,
      nameTitle: formProps["name_title"]?.toString(),
      firstName: formProps["first_name"]!.toString(),
      lastName: formProps["last_name"]!.toString(),
      target: parseInt(formProps["target_amount"]!.toString()),
      email: formProps["email"]?.toString(),
      phone: formProps["phone"]?.toString(),
    });
  };

  return (
    <form
      dir={lang == "he" ? "rtl" : "ltr"}
      id="donation-form"
      className="p-6"
      onSubmit={onSubmitEv}
    >
      <Stack pos="relative">
        <LoadingOverlay visible={visible} overlayBlur={2} />
        <Title align="center">{t[lang].title(data["שם קמפיין"])}</Title>
        <TextInput name="name_title" label={t[lang].nameTitle} />
        <TextInput name="first_name" required label={t[lang].firstName} />
        <TextInput name="last_name" required label={t[lang].lastName} />
        <TextInput name="email" type="email" label={t[lang].email} />
        <TextInput name="phone" type="tel" label={t[lang].phone} />
        <NumberInput
          name="target_amount"
          required
          min={0}
          label={t[lang].targetAmount}
        />
        <Button type="submit"> {t[lang].submit}</Button>
      </Stack>
    </form>
  );
};

const t = {
  he: {
    title: (name?: string) => `יצירת שגריר לקמפיין ${name}`,
    nameTitle: "תואר",
    firstName: "שם פרטי",
    lastName: "שם משפחה",
    email: "דואר אלקטרוני",
    phone: "טלפון",
    submit: "צור שגריר",
    targetAmount: "יעד (₪)",
    name: "שם:",
    target: "יעד:",
    backToAmb: "חזרה לדף יצירת שגרירים",
    backToMainPage: "חזרה לדף הראשי",
    goToCrm: "מעבר ל-crm",
    ambDetails: "פרטי שגריר"
  },
  en: {
    title: (name?: string) => `Create ambassador for ${name}`,
    nameTitle: "Name Title",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Phone",
    submit: "Create Ambassador",
    targetAmount: "Target (₪)",
    name: "Name:",
    target: "Target:",
    backToAmb: "Back to ambassador creation page",
    backToMainPage: "Back to the main page",
    goToCrm: "crm",
    ambDetails: "Ambassador details"
  },
} as const;

export default CreateAmb;
