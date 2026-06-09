interface ResponseData {
  statusCode: number;
  status: string;
  message: string;
  data?: object;
  type?: string;
  token?: string;
}

export const response = (responseData: ResponseData = {} as ResponseData) => {
  const responseObject: {
    code: number;
    status: string;
    message: string;
    data?: Record<string, unknown>;
  } = {
    code: responseData.statusCode,
    message: responseData.message,
    status: responseData.status,
    data: {},
  };

  if (responseData.type) {
    responseObject.data = { ...responseObject.data, type: responseData.type };
  }

  if (responseData.data) {
    responseObject.data = responseData.data as Record<string, unknown>;
  }

  if (responseData.token) {
    responseObject.data = { ...responseObject.data, token: responseData.token };
  }

  return responseObject;
};
