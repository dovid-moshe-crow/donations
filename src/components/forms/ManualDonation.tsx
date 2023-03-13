/* eslint-disable */

import {
  Button,
  Card,
  Checkbox,
  Group,
  LoadingOverlay,
  Select,
  Stack,
  Textarea,
  TextInput,
  Title,
  Text,
  Anchor
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { api } from "~/utils/api";
import Amount from "../Amount";
import LoadingScreen from "../LoadingScreen";

const ManualDonation = ({
  campaignId,
  ambId,
  lang = "he",
}: {
  campaignId: string;
  ambId?: string;
  lang: "he" | "en";
}) => {
  const [visible, { close, open }] = useDisclosure(false);

  const { data } = api.campaignsExcel.getById.useQuery(campaignId);

  const { mutate, data: donationResult } =
    api.powerlink.recordDonation.useMutation();

  if (!data) {
    return <LoadingScreen />;
  }

  if (donationResult) {
    return (
      <div className="flex h-screen items-center">
        <div className="container mx-auto flex items-center justify-center">
          <Card withBorder dir={lang=="he" ? "rtl" : "ltr"} w={600}>
            <Stack>
              <Title align="center">פרטי התרומה</Title>
              <Group>
                <Text color="blue" weight="bold">
                  שם:
                </Text>
                <Text weight="bold">{donationResult.name}</Text>
              </Group>

              <Group>
                <Text color="blue" weight="bold">
                  סכום:
                </Text>
                <Text weight="bold">{donationResult.amount}</Text>
              </Group>

              <Button onClick={() => window.location.reload()}>
                לחזרה לדף התרומות
              </Button>
              <Anchor href={`/landing/forms?id=${campaignId}`} align="center">
                למעבר לדף הראשי
              </Anchor>
              <Anchor href={`https://app.powerlink.co.il/app/record/1009/${donationResult.id}`} align="center">
                למעבר ל-crm
              </Anchor>
            </Stack>
          </Card>
        </div>
      </div>
    );
  }

  const onSubmitEv = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    open();

    var formData = new FormData(e.target as any);
    const formProps = Object.fromEntries(formData);

    mutate({
      campaignId,
      name: formProps["full_name"]!.toString(),
      multiplier: parseInt(data["multiplier"]),
      amount: parseInt(formProps["amount"]!.toString()),
      displayName:
        formProps["anonymous"] != "on"
          ? `${formProps["name_title"]!.toString()} ${formProps[
              "full_name"
            ]!.toString()}`
          : "אנונימי",
      address: formProps["address"]?.toString(),
      email: formProps["email"]?.toString(),
      phone: formProps["phone"]?.toString(),
      collectionMethod: formProps["collection_method"]?.toString(),
      dedication: formProps["dedication"]?.toString(),
      comments: formProps["comments"]?.toString(),
      currency: formProps["currency"]?.toString(),
      fundraiserEmail: formProps["fundraiser_email"]?.toString(),
      fundraiserName: formProps["fundraiser_name"]?.toString(),
      fundraiserPhone: formProps["fundraiser_phone"]?.toString(),
    });
  };

  return (
    <form dir={lang=="he" ? "rtl" : "ltr"} id="donation-form" className="p-6" onSubmit={onSubmitEv}>
      <Stack pos="relative">
        <LoadingOverlay visible={visible} overlayBlur={2} />
        <Title align="center" >{data["שם קמפיין"]}</Title>
        <TextInput name="name_title" label="תואר" />
        <TextInput name="full_name" required label="שם מלא" />
        <Checkbox label="תרומה אנונימית" name="anonymous" />
        <TextInput name="email" type="email" label="דואר אלקטרוני" />
        <TextInput name="phone" type="tel" label="טלפון נייד" />
        <TextInput name="address" type="text" label="כתובת" />
        <Textarea name="dedication" label="הקדשה" />
        <Textarea name="comments" label="הערות" />
        <Amount
          currencyFrom={["ILS", "USD", "EUR"]}
          currencyTo="ILS"
          multiplier={parseInt(data["multiplier"])}
          sub={false}
          lang={lang}
        />

        <Title>פרטי מתרים</Title>
        <TextInput name="fundraiser_name" label="שם מתרים" />
        <TextInput name="fundraiser_phone" type="tel" label="טלפון מתרים" />
        <TextInput name="fundraiser_email" type="email" label="אימייל מתרים" />
        <Select
          label="נאסף"
          name="collection_method"
          defaultValue="5"
          data={[
            { label: `הו"ק`, value: "1" },
            { label: `מזומן`, value: "2" },
            { label: `העברה בנקאית`, value: "3" },
            { label: `אחר`, value: "4" },
            { label: `לא`, value: "5" },
          ]}
        ></Select>
        <Button type="submit">תרום</Button>
      </Stack>
    </form>
  );
};

export default ManualDonation;
