export const invalidAddressErrorDetail = (address: string) => `invalid address: ${address}`;

export const missingFieldErrorDetail = (field: string) => `missing field: ${field}`;

export const invalidPackageErrorDetail = (pkg: string) => `invalid package address: ${pkg}`;

export enum ErrorType {
  BadRequest,
}

interface ErrorInterface {
  errorCode: number
  errorMessage: string
  details?: string
}

const Errors: Record<ErrorType, ErrorInterface> = {
  [ErrorType.BadRequest]: {
    errorCode: 400,
    errorMessage: 'Bad Request',
  },
};

export class S3MoneyError extends Error implements ErrorInterface {
  errorCode: number;
  errorMessage: string;
  details?: string | undefined;

  constructor(errorType: ErrorType, errorDetails?: string) {
    const { errorMessage, errorCode, details } = Errors[errorType];

    super(errorMessage);
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
    this.details = errorDetails ?? details;
  }
}

// eof
