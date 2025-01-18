import HttpError from '../models/http-error';
import User from '../models/user';
import { getUserKakaoId } from '../services/kakao-service';
import { NextFunction, Request, Response } from 'express';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.split(' ')[1];
  const { nickname } = req.body;

  if (!accessToken) {
    const error = new HttpError('토큰이 없어 유저 생성에 실패했습니다.', 401);
    return next(error);
  }

  if (!nickname) {
    const error = new HttpError('닉네임은 필수입니다.', 400);
    return next(error);
  }

  // 닉네임 유효성 검사
  const nicknameRegex = /^[가-힣a-zA-Z]{2,6}$/;
  if (!nicknameRegex.test(nickname)) {
    const error = new HttpError(
      '닉네임은 한글, 영어 2~6자만 입력 가능합니다.',
      422
    );
    return next(error);
  }

  try {
    // 카카오 API에서 사용자 카카오 ID 가져오기
    const kakaoId = await getUserKakaoId(accessToken);

    // 이미 존재하는 사용자 확인
    const existingUser = await User.findOne({ kakaoId });

    if (existingUser) {
      const error = new HttpError('이미 존재하는 사용자입니다.', 409);
      return next(error);
    }

    // 닉네임 중복 확인
    const existingNickname = await User.findOne({ nickname });
    if (existingNickname) {
      const error = new HttpError('이미 사용중인 닉네임입니다.', 409);
      return next(error);
    }

    // 새로운 사용자 생성
    const createdUser = new User({
      nickname,
      kakaoId,
    });

    // 사용자 정보 저장
    await createdUser.save();

    // 유저 생성 성공 시
    res.status(201).json({ nickname });
  } catch (err) {
    const error = new HttpError('유저 생성에 실패했습니다.', 400);
    return next(error);
  }
};

export { createUser };
