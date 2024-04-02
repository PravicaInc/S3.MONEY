export const suiAddressRegExp = /^0[xX][a-fA-F0-9]{64}$/;

export const isSuiAddress = (address: string) => suiAddressRegExp.test(address);
