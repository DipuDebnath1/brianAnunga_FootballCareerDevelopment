export interface IErrorMessage {
  path: string | number;
  message: string;
}

export interface ISimplifiedError {
  statusCode: number;
  message: string;
  errorMessages: IErrorMessage[];
}
