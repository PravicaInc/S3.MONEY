export const numberNormalize = (value: string = ''): number => Number(`${value}`.replace(/\D+/g, ''));

export const numberFormat = (value: string): string => value
  ? new Intl.NumberFormat('en-US').format(numberNormalize(value))
  : value;
