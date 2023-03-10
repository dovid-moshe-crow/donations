/* eslint-disable */
import { Button, Stack, Card } from "@mantine/core";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

const FormsLandingPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const campaignId =
    typeof id === "string" ? id : "177b5cd5-2a69-4933-992e-1dd3599eb77e";

  return (
    <>
      <div className="flex h-screen items-center">
        <div className="container mx-auto flex items-center justify-center">
          <Card withBorder w={400}>
            <Stack>
              <Link href={`/forms/bit?id=${campaignId}`} className="grid">
                <Button>Bit</Button>
              </Link>
              <Link href={`/forms/stripe?id=${campaignId}`} className="grid">
                <Button>Stripe</Button>
              </Link>
              <Link
                href={`/forms/nedarim-credit?id=${campaignId}`}
                className="grid"
              >
                <Button>כרטיס אשראי</Button>
              </Link>
              <Link
                href={`/forms/manual-donation?id=${campaignId}`}
                className="grid"
              >
                <Button>תרומה פקטיבית</Button>
              </Link>
            </Stack>
          </Card>
        </div>
      </div>
    </>
  );
};

export default FormsLandingPage;
