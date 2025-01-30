type ErrorMessageKeys =
  | 'KAKAO_LOGIN'
  | 'KAKAO_LOGOUT'
  | 'CREATE_USER'
  | 'SEARCH_FRIEND'
  | 'GET_FRIEND'
  | 'APPLY_FRIEND'
  | 'GET_FRIEND_RECEIPTS'
  | 'RECEPT_FRIEND'
  | 'CANCEL_FRIEND_APPLY'
  | 'GET_RANK'
  | 'COMMON';

// type ErrorMessages = {
//   [K in ErrorMessageKeys]: { [key: string]: string };
// };

interface ErrorMessages {
  [key: string]: { [key: string]: string};
}

// key: 서버에서 응답받은 errorType
// value: 클라이언트에 보여줄 에러 문구
// 모든 api에 공통으로 나올 수 있는 error는 COMMON에 정의
export const ERROR_MESSAGES: ErrorMessages = {
  KAKAO_LOGIN: {
    FAILED_KAKAO_LOGIN: '카카오 로그인에\n실패하였습니다.',
    INVALID_REDIRECT_URI: '카카오 로그인에\n실패하였습니다.',
    INVALID_CODE: '카카오 로그인에\n실패하였습니다.',
  },
  KAKAO_LOGOUT: {
    FAILED_KAKAO_LOGOUT: '잠시 후 다시 시도해주세요.',
    MISSING_USER_ID: '잠시 후 다시 시도해주세요.',
  },
  CREATE_USER: {
    MISSING_NICKNAME: '닉네임은 필수입니다.',
    DUPLICATED_NICKNAME: '이미 사용중인 닉네임입니다.',
    SIGNEDUP_USER: '이미 가입한 유저입니다.',
    IVALID_NICKNAME: '한글, 영어 2~6자',
    FAILED_CREATE_USER: '잠시 후 다시 시도해주세요.',
  },
  SEARCH_FRIEND: {},
  GET_FRIEND: {},
  APPLY_FRIEND: {},
  GET_FRIEND_RECEIPTS: {},
  RECEPT_FRIEND: {},
  CANCEL_FRIEND_APPLY: {},
  GET_RANK: {},
  COMMON: {
    ERR_NETWORK: '서버 연결이 불안정합니다.\n잠시 후 다시 시도해주세요.',
    MISSING_JWT_ACCESS_TOKEN: '다시 로그인 해주세요.',
    OTHER: '알 수 없는 에러가 발생했습니다.\n잠시 후 다시 시도해주세요.',
  },
};
