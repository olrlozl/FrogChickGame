import { AxiosError } from 'axios';
import { ERROR_MESSAGES, ErrorMessageKeys } from 'constants/errorMessages';
import { SetState } from 'types/common';

export const errorHandle = (
  e: unknown,
  setErrorMessage: (errorMessage: string) => void | SetState<string>,
  errorKey: ErrorMessageKeys
) => {
  if (e instanceof AxiosError && e.response?.data.errorType) {
    // axiosInstance에서 처리한 에러를 중복 처리하지 않기 위해
    if (
      e.response.data.errorType !== 'EXPIRED_JWT_TOKEN' &&
      e.response.data.errorType !== 'MISSING_JWT_ACCESS_TOKEN'
    )
      setErrorMessage(ERROR_MESSAGES[errorKey][e.response.data.errorType]);
  }
};
