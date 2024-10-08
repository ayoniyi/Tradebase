export const shortenAddress = (address: any) =>
  `${address?.slice(0, 9)}...${address.slice(address.length - 6)}`;

export const shortenAddressSmall = (address: any) =>
  `${address?.slice(0, 7)}...`;

export const shortenHex = (hex: string): string => {
  if (hex?.length < 7) {
    throw new Error("Hex string must be at least 7 characters long.");
  }
  return `${hex?.slice(0, 5)}...${hex?.slice(-4)}`;
};

export const capitalizeFirstLetter = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};
