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

export function shortNumberFormat(num: number, precision = 2): string {
  const map = [
    { suffix: 'T', threshold: 1e12 },
    { suffix: 'B', threshold: 1e9 },
    { suffix: 'M', threshold: 1e6 },
    { suffix: 'K', threshold: 1e3 },
    { suffix: '', threshold: 1 },
  ];

  const found = map.find(x => Math.abs(num) >= x.threshold);

  return found
    ? (num / found.threshold).toFixed(precision) + found.suffix
    : `${num}`;
}
