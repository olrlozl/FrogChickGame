import HttpError from '../models/http-error';

export const validateNickname = (nickname: string) => {
  const nicknameRegex = /^[가-힣a-zA-Z]{2,6}$/;
  if (!nicknameRegex.test(nickname)) {
    throw new HttpError(
      '닉네임은 한글, 영어 2~6자만 입력 가능합니다.',
      422,
      'INVALID_NICKNAME'
    );
  }
};
