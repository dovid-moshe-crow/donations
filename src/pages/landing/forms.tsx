/* eslint-disable */
import {
  Button,
  Stack,
  Card,
  Anchor,
  Box,
  LoadingOverlay,
  Text,
  Group,
} from "@mantine/core";
import { InferGetServerSidePropsType, NextApiResponse, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaStripe, FaCreditCard } from "react-icons/fa";
import { api } from "~/utils/api";

export const getServerSideProps = async ({
  query,
}: {
  res: NextApiResponse;
  query: Record<string, string>;
}) => {
  return { props: { query } };
};

const FormsLandingPage = ({
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { id } = query;

  const campaignId =
    typeof id === "string" ? id : "177b5cd5-2a69-4933-992e-1dd3599eb77e";

  const { data } = api.campaignsExcel.getById.useQuery(campaignId);

  if (!data) {
    return (
      <Box pos="relative">
        <LoadingOverlay visible={true} overlayBlur={2} />
      </Box>
    );
  }

  return (
    <>
      <div className="flex h-screen items-center">
        <div className="container mx-auto flex items-center justify-center">
          <Card withBorder w={400} dir="rtl">
            <Text color="dark" align="center" mb="sm" size={20}>
              {data["שם קמפיין"]}
            </Text>
            <Stack>
              <Link href={`/forms/manual-donation?id=${campaignId}`}>
                <Button fullWidth>תרומה פקטיבית</Button>
              </Link>
              <Link href={`/forms/create-amb?id=${campaignId}`}>
                <Button fullWidth>יצירת שגריר</Button>
              </Link>
              <Link href={`/forms/bit?id=${campaignId}`} target="_blank">
                <Button fullWidth color="teal">
                  Bit
                </Button>
              </Link>
              <Link href={`/forms/stripe?id=${campaignId}`} target="_blank">
                <Button fullWidth color="violet">
                  Stripe
                </Button>
              </Link>
              <Link
                href={`/forms/nedarim-credit?id=${campaignId}`}
                target="_blank"
              >
                <Button fullWidth color="dark">
                  כרטיס אשראי
                </Button>
              </Link>

              <Group position="apart">
                <Anchor
                  target={"_blank"}
                  href={`https://app.powerlink.co.il/app/record/1008/${campaignId}`}
                >
                  למעבר ל-crm
                </Anchor>

                <Anchor
                  target={"_blank"}
                  href={`https://yeshivatcy.co.il/campaign/${data["שם קמפיין"]}`}
                >
                  לאתר הקמפיין
                </Anchor>
              </Group>
            </Stack>
          </Card>
        </div>
      </div>
    </>
  );
};

export default FormsLandingPage;
