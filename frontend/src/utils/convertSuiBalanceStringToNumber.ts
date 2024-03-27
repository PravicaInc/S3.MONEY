const convertSuiBalanceStringToNumber = (balance: string): number => parseInt(balance) / 10e8;

export default convertSuiBalanceStringToNumber;
