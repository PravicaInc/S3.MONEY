import * as yup from 'yup';

export const REQUIRED_STRING = yup.string().required('This field is required');

export const OPTIONAL_STRING = yup.string().optional();

export const REQUIRED_BALANCE = yup.number()
  .typeError('This field is required')
  .test('len', 'Maximum balance is 99,999,999,999', val => (val?.toString().length || 0) <= 11)
  .min(1, 'Minimum balance is 1')
  .required('This field is required');

export const REQUIRED_EMAIL = yup.string().email('Please enter a valid email address')
  .required('This field is required')
  .matches(/^(?!.+@(gmail|google|yahoo|outlook|hotmail|msn)\..+)(.+@.+\..+)$/, 'Contact info should be business email address')
;

