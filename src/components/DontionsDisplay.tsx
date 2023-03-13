import { Paper, Card, Text } from "@mantine/core";

const DonationsDisplay = ({
  donations,
}: {
  donations: {
    name: string;
    amount: number;
    currency: string;
    dedication?: string;
    amb?: string;
  }[];
}) => {
  <div className="p-4" dir="rtl">
    {/* <Card withBorder radius="md" p="xl" shadow="md">
      <Text size="lg" weight={500}>
        {`${data.target.toFixed(0)}₪ / ${data.totalAmountILS.toFixed(0)}₪`}
      </Text>
      <Progress value={data.percent} mt="md" size="lg" radius="xl" />
    </Card> */}

    <div className="-mx-1 mt-1 flex flex-wrap ">
      {donations.map(({ dedication, name, amount, amb, currency }, i) => (
        <DonationDispaly
          amb={amb}
          dedication={dedication}
          amount={amount}
          currency={currency}
          name={name}
          key={i}
        />
      ))}
    </div>
  </div>;
};

const DonationDispaly = ({
  amount,
  name,
  currency,
  amb,
  dedication,
}: {
  name: string;
  amount: number;
  currency: string;
  dedication?: string;
  amb?: string;
}) => {
  return (
    <Paper p={4} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
      <Card withBorder h={150} shadow="md" radius="md">
        <Text color="blue" weight="bolder" fz={18} align="center">
          {name}
        </Text>
        <Text color="green" fz={20} align="center">
          {amount.toFixed(2)}
          {currency}
        </Text>
        <Text align="center">{dedication} </Text>
        <Text align="center" color="dimmed">
          {amb}
        </Text>
      </Card>
    </Paper>
  );
};

export default DonationsDisplay;
