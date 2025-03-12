export interface IResponseHttpError {
  status: number;
  data: {
    message?: string;
    error?: string;
  };
}

const getErrorMessage = (error: IResponseHttpError) => {
  let message = 'Something went wrong!';
  if (error?.data?.message) {
    message = error.data.message;
  } else if (error?.data?.error) {
    message = error.data.error;
  } else if (typeof error === 'string') {
    message = error;
  }
  return message;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getResponseErrorMessage = (error: any): string => {
  if (error?.data?.message) {
    if (Array.isArray(error.data.message)) {
      return error.data.message.join('. ');
    }
    return error.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  if (error?.error) {
    return error.error;
  }
  return 'Server unavailable';
};

export { getErrorMessage, getResponseErrorMessage };
