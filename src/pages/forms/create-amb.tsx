/* eslint-disable */

import {
  Button,
  NumberInput,
  Stack,
  TextInput,
  Text,
  Container,
  Alert,
  Title,
  LoadingOverlay,
  Card,
  Group,
} from "@mantine/core";
import { NextPage } from "next";
import { useDisclosure } from "@mantine/hooks";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

const CreateAmb: NextPage = () => {
  const router = useRouter();
  const { id, amb } = router.query;

  const campaignId =
    typeof id === "string" ? id : "177b5cd5-2a69-4933-992e-1dd3599eb77e";
  const [visible, { close, open }] = useDisclosure(false);
  const { data: createAmbResult, mutate } =
    api.powerlink.createAmbassador.useMutation();

  if (createAmbResult) {
    return (
      <div className="flex h-screen items-center">
        <div className="container mx-auto flex items-center justify-center">
          <Card withBorder dir="rtl" w={600}>
            <Stack>
              <Title align="center">פרטי השגריר</Title>
              <Group>
                <Text color="blue" weight="bold">
                  שם:
                </Text>
                <Text weight="bold">{createAmbResult.name}</Text>
              </Group>

              <Group>
                <Text color="blue" weight="bold">
                  יעד:
                </Text>
                <Text weight="bold">{createAmbResult.target}</Text>
              </Group>

              <Button onClick={() => window.location.reload()}>
                לחזרה לדף יצירת שגירים
              </Button>
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
    <form dir="rtl" id="donation-form" className="p-6" onSubmit={onSubmitEv}>
      <Stack pos="relative">
        <LoadingOverlay visible={visible} overlayBlur={2} />
        <Title align="center">יצירת שגריר</Title>
        <TextInput name="name_title" label="תואר" />
        <TextInput name="first_name" required label="שם פרטי" />
        <TextInput name="last_name" required label="שם משפחה" />
        <TextInput name="email" type="email" label="דואר אלקטרוני" />
        <TextInput name="phone" type="tel" label="טלפון" />
        <NumberInput name="target_amount" required min={0} label="יעד (₪)" />
        <Button type="submit">צור שגריר</Button>
      </Stack>
    </form>
  );
};

export default CreateAmb;
