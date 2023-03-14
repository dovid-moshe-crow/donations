import { Stack, Group, Button, } from "@mantine/core";
import { Carousel } from '@mantine/carousel';
import BitForm from "./Bit";
import NedarimCredit from "./NedarimCredit";
import StripeForm from "./Stripe";


const CombinedForms = ({
    campaignId, ambId, lang
}: {
    campaignId: string;
    ambId?: string;
    lang: "he" | "en",
}) => {


    return <div className="flex items-center">
        <div className="container mx-auto flex  justify-center"> <Stack>
            <Group position="apart">
                <Button w={120} color={"cyan"} >{t[lang].bit}</Button>
                <Button w={120} >{t[lang].stripe}</Button>
                <Button w={120} color={"dark"}>{t[lang].credit}</Button>
            </Group>
            <Carousel>
            <BitForm campaignId={campaignId} ambId={ambId} lang={lang} />
            <StripeForm campaignId={campaignId} ambId={ambId} lang={lang} />
            <NedarimCredit campaignId={campaignId} ambId={ambId} lang={lang} />
            </Carousel>
        </Stack>
        </div>
    </div>

}

const t = {
    he: {
        stripe: "Stripe",
        credit: "כרטיס אשראי",
        bit: "ביט",
    },

    en: {
        stripe: "Stripe",
        credit: "Credit Card",
        bit: "Bit",
    }
} as const;

export default CombinedForms;