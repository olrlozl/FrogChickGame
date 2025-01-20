import HttpError from '../models/http-error';
import User from '../models/user';
import {
  getKakaoTokens,
  getUserKakaoId,
  logoutKakao,
} from '../services/kakao-service';
import { NextFunction, Request, Response } from 'express';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { nickname, kakaoId } = req.body;

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
    // 이미 존재하는 사용자 확인
    const existingUser = await User.findOne({ kakaoId });

    if (existingUser) {
      const error = new HttpError('이미 가입한 이력이 있습니다.', 409);
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
    res.status(204).send();
  } catch (error) {
    return next(new HttpError('유저 생성에 실패했습니다.', 400));
  }
};

const kakaoLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { redirectUri, code } = req.body;

  if (!redirectUri) {
    return next(new HttpError('redirectUri가 올바르지 않습니다.', 400));
  }
  if (!code) {
    return next(new HttpError('code가 올바르지 않습니다.', 400));
  }

  try {
    // 카카오 API에서 인가 코드로 액세스 토큰과 리프레시 토큰 받기
    const { kakaoAccessToken, kakaoRefreshToken } = await getKakaoTokens(
      redirectUri,
      code
    );

    // 카카오 API에서 사용자 카카오 ID 가져오기
    const kakaoId = await getUserKakaoId(kakaoAccessToken);

    // 이미 존재하는 사용자 확인
    const existingUser = await User.findOne({ kakaoId });

    let nickname: string | null = null;
    if (existingUser) {
      nickname = existingUser.nickname; // 이미 등록된 닉네임
    }

    // 카카오 로그인에 성공 시
    res.status(200).json({
      kakaoAccessToken,
      kakaoId,
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    } else {
      return next(new HttpError('카카오 로그인에 실패했습니다.', 400));
    }
  }
};

const kakaoLogout = async (req: Request, res: Response, next: NextFunction) => {
  const kakaoAccessToken = req.headers.authorization?.split(' ')[1];

  if (!kakaoAccessToken) {
    const error = new HttpError(
      '토큰이 없어 카카오 로그아웃에 실패했습니다.',
      401
    );
    return next(error);
  }

  try {
    await logoutKakao(kakaoAccessToken);
    // 카카오 로그아웃 성공 시
    res.status(204).send();
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    } else {
      return next(new HttpError('카카오 로그아웃에 실패했습니다.', 400));
    }
  }
};

export { createUser, kakaoLogin, kakaoLogout };
