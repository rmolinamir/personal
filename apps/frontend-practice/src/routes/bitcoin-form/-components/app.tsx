import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@acme/ui/components/card";
import { Separator } from "@acme/ui/components/separator";
import type React from "react";
import {
  BitcoinForm,
  BitcoinFormDetails,
  BitcoinFormInput,
  BitcoinFormLabel,
  BitcoinFormSubmitButton,
  BitcoinFormTotal,
} from "./components";

const ACCOUNT_BALANCE = {
  currency: "USD",
  value: 10000,
} satisfies React.ComponentProps<typeof BitcoinForm>["accountBalance"];

const BITCOIN_QUOTE = {
  currency: "USD",
  value: 66000,
} satisfies React.ComponentProps<typeof BitcoinForm>["bitcoinQuote"];

const PURCHASE_FEE = 0.02 satisfies React.ComponentProps<
  typeof BitcoinForm
>["purchaseFee"];

export function App() {
  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(event.currentTarget));

    window.alert(`Submission:\n${JSON.stringify(data, undefined, 2)}`);
  }

  return (
    <BitcoinForm
      className="flex min-h-svh w-full items-center justify-center"
      accountBalance={ACCOUNT_BALANCE}
      bitcoinQuote={BITCOIN_QUOTE}
      purchaseFee={PURCHASE_FEE}
      onSubmit={handleSubmit}
    >
      <Card className="h-fit w-full max-w-lg">
        <CardHeader>Buy Bitcoin</CardHeader>
        <CardContent>
          <div>
            <BitcoinFormInput name="bitcoin" />
            <BitcoinFormLabel htmlFor="bitcoin" />
          </div>
          <Separator className="my-4" />
          <BitcoinFormDetails />
          <Separator className="my-4" />
          <BitcoinFormTotal />
        </CardContent>
        <CardFooter>
          <BitcoinFormSubmitButton />
        </CardFooter>
      </Card>
    </BitcoinForm>
  );
}
