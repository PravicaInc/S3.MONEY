export const numberNormalize = (value: string = ''): number => Number(`${value}`.replace(/\D+/g, ''));

export const numberFormat = (value: string): string => value
  ? new Intl.NumberFormat('en-US').format(numberNormalize(value))
  : value;

export const priceFormat = (value: string): string => value
  ? new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
    minimumFractionDigits: value.indexOf('.') !== -1 ? 2 : 0,
  })
    .format(numberNormalize(value))
  : value;

export const getShortAccountAddress = (accountAddress: string, partLength: number = 4) => (
  `${accountAddress.substring(0, partLength)}...${accountAddress.substring(accountAddress.length - partLength)}`
);
