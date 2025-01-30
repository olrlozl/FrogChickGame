import { AxiosError } from 'axios';
import { ERROR_MESSAGES } from 'constants/errorMessages';
import { SetState } from 'types/common';

export const errorHandle = (
  e: unknown,
  setErrorMessage: (errorMessage: string) => void | SetState<string>,
  errorKey: string
) => {
  if (e instanceof AxiosError && e.response?.data.errorType) {
    setErrorMessage(ERROR_MESSAGES[errorKey][e.response.data.errorType]);
  }
};
