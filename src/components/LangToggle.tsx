import { Group, SegmentedControl, Center, Box } from "@mantine/core";
import { useLang } from "~/context/lang";

export function LangToggle() {
  const { lang, setLang } = useLang();

  console.log(lang);

  return (
    <Group position="center" my="xl" dir={lang == "he" ? "rtl" : "ltr"}  >
      <SegmentedControl
        
        value={lang}
        onChange={(v: "he" | "en") => {
          console.log(v);
          setLang(v);
        }}
        data={[
          {
            value: lang == "he" ? "he" : "en",
            label: (
              <Center>
                <Box ml={10}>{lang == "he" ? "עברית" : "English"}</Box>
              </Center>
            ),
          },
          {
            value: lang == "he" ? "en" : "he",
            label: (
              <Center>
                <Box ml={10}>{lang == "he" ? "English" : "עברית"}</Box>
              </Center>
            ),
          },
        ]}
      />
    </Group>
  );
}
