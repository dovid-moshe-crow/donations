/* eslint-disable */

import { Button, Checkbox, Stack, Textarea, TextInput } from "@mantine/core";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import AmbSelect from "~/components/AmbSelect";
import Amount from "~/components/Amount";
import MultiSub from "~/components/MultiSub";

const StripePage: NextPage = () => {
  const router = useRouter();

  const { Multiplier, id, amb } = router.query;

  const campaignId =
    typeof id === "string" ? id : "177b5cd5-2a69-4933-992e-1dd3599eb77e";
  const ambId = typeof amb === "string" ? amb : undefined;

  const multiplier = parseInt(typeof Multiplier == "string" ? Multiplier : "1");

  return (
    <>
      <Head>
        <title>Stripe</title>
        <meta name="description" content="Stripe Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <form
        dir="rtl"
        id="donation-form"
        action="/api/stripe/create-checkout"
        method="post"
        className="p-6"
      >
        <Stack>
          <AmbSelect campaignId={campaignId} ambassadorId={ambId} />
          <TextInput name="full_name" required label="שם מלא" />
          <TextInput name="email" type="email" label="דואר אלקטרוני" />
          <TextInput name="phone" type="tel" label="טלפון נייד" />
          <TextInput name="address" type="text" label="כתובת" />
          <TextInput name="city" type="text" label="עיר" />
          <Checkbox label="תרומה אנונימית" name="anonymous" />
          <Textarea name="dedication" label="הקדשה" />
          <MultiSub name="months" noLimitValue="0" />
          <Amount label="סכום" multiplier={multiplier} />
          <Button type="submit">תרום</Button>
        </Stack>
      </form>
    </>
  );
};

export default StripePage;
