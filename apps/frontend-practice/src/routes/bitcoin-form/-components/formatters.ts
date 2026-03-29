export const locale = "en-US";
export const currency = "USD";

export const decimalFormatter = new Intl.NumberFormat(locale, {
  currency,
  style: "decimal",
});
export const currencyFormatter = new Intl.NumberFormat(locale, {
  currency,
  style: "currency",
});

const localeParts = decimalFormatter.formatToParts(1234.5);

export const decimalSeparator =
  localeParts.find((part) => part.type === "decimal")?.value ?? ".";
export const groupSeparator =
  localeParts.find((part) => part.type === "group")?.value ?? ",";

export function removeGroupSeparators(value: string) {
  return value.replaceAll(groupSeparator, "");
}

export function removeNonDigits(value: string) {
  return value.replace(/\D/g, "");
}
