/* eslint-disable */

import {
  Box,
  Button,
  Checkbox,
  LoadingOverlay,
  Stack,
  Title,
  Text,
  Textarea,
  TextInput,
  Group,
  Alert,
  Select,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Amount from "~/components/Amount";
import { api } from "~/utils/api";

const ManualDonationPage: NextPage = () => {
  const [visible, { close, open }] = useDisclosure(false);
  const router = useRouter();
  const { id, amb } = router.query;

  const campaignId =
    typeof id === "string" ? id : "177b5cd5-2a69-4933-992e-1dd3599eb77e";
  const ambId = typeof amb === "string" ? amb : undefined;

  const { data } = api.campaignsExcel.getById.useQuery(campaignId);

  const { mutate, data: donationResult } =
    api.powerlink.recordDonation.useMutation();

  if (!data) {
    return (
      <Box pos="relative">
        <LoadingOverlay visible={true} overlayBlur={2} />
      </Box>
    );
  }

  if (donationResult) {
    return (
      <Alert dir="rtl">
        <Text>
          נתרם ע"י {donationResult.name} {donationResult.amount} שקלים
        </Text>

        <Button onClick={() => window.location.reload()}>
          לחזרה לדף התרומות
        </Button>
      </Alert>
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
    <form dir="rtl" id="donation-form" className="p-6" onSubmit={onSubmitEv}>
      <Stack pos="relative">
        <LoadingOverlay visible={visible} overlayBlur={2} />
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
          label="סכום"
          sub={false}
        />

        <Title>פרטי מתרים</Title>
        <TextInput name="fundraiser_name" label="שם מתרים" />
        <TextInput name="fundraiser_phone" type="tel" label="טלפון מתרים" />
        <TextInput name="fundraiser_email" type="email" label="אימייל מתרים" />
        <Select
          label="נאסף"
          name="collection_method"
          data={[
            { label: `הו"ק`, value: "1" },
            { label: `מזומן`, value: "2" },
            { label: `העברה בנקאית`, value: "3" },
            { label: `אחר`, value: "4" },
          ]}
        ></Select>
        <Button type="submit">תרום</Button>
      </Stack>
    </form>
  );
};

export default ManualDonationPage;
