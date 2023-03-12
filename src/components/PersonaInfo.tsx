/* eslint-disable */

import { Checkbox, Textarea, TextInput } from "@mantine/core";

const PersonalInfo = ({
  addressRequired = false,
  cityRequired = false,
  dedicationRequired = false,
  emailRequired = false,
  fullNameRequired = false,
  phoneRequired = false,
  lang,
}: {
  lang: "en" | "he";
  fullNameRequired?: boolean;
  emailRequired?: boolean;
  phoneRequired?: boolean;
  addressRequired?: boolean;
  cityRequired?: boolean;
  dedicationRequired?: boolean;
}) => {
  return (
    <>
      <TextInput
        name="full_name"
        label={t[lang].fullName}
        required={fullNameRequired}
      />
      <TextInput
        name="email"
        type="email"
        label={t[lang].email}
        required={emailRequired}
      />
      <TextInput
        name="phone"
        type="tel"
        label={t[lang].phone}
        required={phoneRequired}
      />
      <TextInput
        name="address"
        type="text"
        label={t[lang].address}
        required={addressRequired}
      />
      <TextInput
        name="city"
        type="text"
        label={t[lang].city}
        required={cityRequired}
      />
      <Checkbox label={t[lang].anonymous} name="anonymous" />
      <Textarea
        name="dedication"
        label={t[lang].dedication}
        required={dedicationRequired}
      />
    </>
  );
};

const t = {
  he: {
    fullName: "שם מלא",
    email: "דואר אלקטרוני",
    phone: "טלפון נייד",
    address: "כתובת",
    city: "עיר",
    anonymous: "תרומה אנונימית",
    dedication: "הקדשה",
  },

  en: {
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    city: "City",
    anonymous: "Anonymous Donation",
    dedication: "Dedication",
  },
} as const;

export default PersonalInfo;
