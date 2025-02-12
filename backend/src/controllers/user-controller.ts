import HttpError from '../models/http-error';
import User from '../models/user';
import {
  getKakaoTokens,
  getKakaoId,
  logoutKakao,
  refreshKakaoAccessToken,
  storeTokenInRedis,
  getTokenFromRedis,
  removeTokensFromRedis,
} from '../services/user-service';
import { NextFunction, Request, Response } from 'express';
import {
  generateJwtToken,
  getUserIdFromJwtAccessToken,
  verifyJwtToken,
} from '../utils/jwt-util';
import { validateNickname } from '../utils/validate';
import { JWT_CONFIG } from '../constants/jwt';

const createNickname = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, nickname } = req.body;

  if (!userId) {
    return next(new HttpError('userId가 필요합니다.', 400, 'MISSING_USERID'));
  }

  if (!nickname) {
    return next(
      new HttpError('nickname이 필요합니다.', 400, 'MISSING_NICKNAME')
    );
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return next(
        new HttpError('사용자를 찾을 수 없습니다.', 404, 'NOT_FOUND_USER')
      );
    }

    if (user.nickname) {
      return next(
        new HttpError(
          '이미 닉네임을 생성한 이력이 있습니다.',
          409,
          'ALREADY_EXISTS_NICKNAME'
        )
      );
    }

    validateNickname(nickname);

    const existingNickname = await User.findOne({ nickname });
    if (existingNickname) {
      return next(
        new HttpError('이미 사용중인 닉네임입니다.', 409, 'DUPLICATED_NICKNAME')
      );
    }

    user.nickname = nickname;

    await user.save();

    const jwtAccessToken = generateJwtToken(user.id, 'access');
    const jwtRefreshToken = generateJwtToken(user.id, 'refresh');

    await storeTokenInRedis(
      user.id,
      jwtRefreshToken,
      JWT_CONFIG['refresh'].expirationSeconds,
      'jwtRefresh'
    );

    // jwt 엑세스 토큰을 HttpOnly, Secure 쿠키로 설정
    res.cookie('access_token', jwtAccessToken, {
      httpOnly: true, // 클라이언트에서 JavaScript로 쿠키 접근 불가
      secure: process.env.NODE_ENV === 'production', // 프로덕션 환경에서만 Secure 플래그 설정
      maxAge: JWT_CONFIG['access'].expirationSeconds * 1000,
      sameSite: 'strict', // CSRF 방지
    });

    res.status(201).send();
  } catch (error) {
    return next(
      new HttpError(
        '닉네임 생성에 실패했습니다.',
        500,
        'FAILED_CREATE_NICKNAME'
      )
    );
  }
};

const kakaoLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { redirectUri, code } = req.body;

  if (!redirectUri) {
    return next(
      new HttpError(
        'redirectUri가 올바르지 않습니다.',
        400,
        'MISSING_REDIRECT_URI'
      )
    );
  }
  if (!code) {
    return next(new HttpError('code가 필요합니다.', 400, 'MISSING_CODE'));
  }

  try {
    const {
      kakaoAccessToken,
      kakaoRefreshToken,
      kakaoAccessTokenExpirationTime,
      kakaoRefreshTokenExpirationTime,
    } = await getKakaoTokens(redirectUri, code);

    const kakaoId = await getKakaoId(kakaoAccessToken);

    const signedupUser = await User.findOne({ kakaoId });

    // 1. 이미 가입했고, 닉네임도 있는 경우
    if (signedupUser && signedupUser.nickname) {
      const jwtAccessToken = generateJwtToken(signedupUser.id, 'access');
      const jwtRefreshToken = generateJwtToken(signedupUser.id, 'refresh');

      await storeTokenInRedis(
        signedupUser.id,
        jwtRefreshToken,
        JWT_CONFIG['refresh'].expirationSeconds,
        'jwtRefresh'
      );

      await storeTokenInRedis(
        signedupUser.id,
        kakaoAccessToken,
        kakaoAccessTokenExpirationTime,
        'kakaoAccess'
      );

      await storeTokenInRedis(
        signedupUser.id,
        kakaoRefreshToken,
        kakaoRefreshTokenExpirationTime,
        'kakaoRefresh'
      );

      // jwt 엑세스 토큰을 HttpOnly, Secure 쿠키로 설정
      res.cookie('access_token', jwtAccessToken, {
        httpOnly: true, // 클라이언트에서 JavaScript로 쿠키 접근 불가
        secure: process.env.NODE_ENV === 'production', // 프로덕션 환경에서만 Secure 플래그 설정
        maxAge: JWT_CONFIG['access'].expirationSeconds * 1000,
        sameSite: 'strict', // CSRF 방지
      });

      res.status(200).send();
    }
    // 2. 이미 가입했지만, 닉네임이 없는 경우
    else if (signedupUser && !signedupUser.nickname) {
      await storeTokenInRedis(
        signedupUser.id,
        kakaoAccessToken,
        kakaoAccessTokenExpirationTime,
        'kakaoAccess'
      );

      await storeTokenInRedis(
        signedupUser.id,
        kakaoRefreshToken,
        kakaoRefreshTokenExpirationTime,
        'kakaoRefresh'
      );

      res.status(200).json({
        userId: signedupUser.id,
      });
    }
    // 3. 최초 로그인한 신규 회원일 경우
    else {
      const createdUser = new User({
        kakaoId,
      });

      await createdUser.save();

      await storeTokenInRedis(
        createdUser.id,
        kakaoAccessToken,
        kakaoAccessTokenExpirationTime,
        'kakaoAccess'
      );

      await storeTokenInRedis(
        createdUser.id,
        kakaoRefreshToken,
        kakaoRefreshTokenExpirationTime,
        'kakaoRefresh'
      );

      res.status(200).json({
        userId: createdUser.id,
      });
    }
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    } else {
      return next(
        new HttpError(
          '카카오 로그인에 실패했습니다.',
          400,
          'FAILED_KAKAO_LOGIN'
        )
      );
    }
  }
};

const kakaoLogout = async (req: Request, res: Response, next: NextFunction) => {
  // checkAuth 미들웨어에서 설정된 userId를 사용해 현재 요청 사용자를 식별
  const userId = req.userId as string;

  let kakaoAccessToken;

  try {
    try {
      kakaoAccessToken = await getTokenFromRedis(userId, 'kakaoAccess');
    } catch (error) {
      // 카카오 엑세스 토큰이 만료되어 Redis에서 제거된 경우 갱신
      if (error instanceof HttpError && error.type === 'NOT_FOUND_TOKEN') {
        const kakaoRefreshToken = await getTokenFromRedis(
          userId,
          'kakaoRefresh'
        );

        const newKakaoAccessToken = await refreshKakaoAccessToken(
          kakaoRefreshToken
        );

        kakaoAccessToken = newKakaoAccessToken;
      } else {
        throw error;
      }
    }

    await logoutKakao(kakaoAccessToken);

    await removeTokensFromRedis(userId);

    await User.findByIdAndUpdate(userId, {
      revokedAt: new Date(),
    });

    res.status(204).send();
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    } else {
      return next(
        new HttpError(
          '카카오 로그아웃에 실패했습니다.',
          400,
          'FAILED_KAKAO_LOGOUT'
        )
      );
    }
  }
};

const refreshJwtAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const jwtAccessToken = req.headers.authorization?.split(' ')[1];

  if (!jwtAccessToken) {
    return next(
      new HttpError(
        'jwt 엑세스 토큰이 필요합니다.',
        401,
        'MISSING_JWT_ACCESS_TOKEN'
      )
    );
  }

  try {
    // 만료된 jwt 엑세스 토큰 검증
    try {
      const decodedToken = await verifyJwtToken(jwtAccessToken, 'access');

      if (decodedToken) {
        return next(
          new HttpError(
            'jwt 엑세스 토큰이 만료되지 않았습니다. 갱신할 필요가 없습니다.',
            400,
            'JWT_ACCESS_TOKEN_NOT_EXPIRED'
          )
        );
      }
    } catch (error) {
      // jwt 엑세스 토큰이 만료된 경우 갱신
      if (error instanceof HttpError && error.type === 'EXPIRED_JWT_TOKEN') {
        const userId = getUserIdFromJwtAccessToken(jwtAccessToken);
        const user = await User.findById(userId);

        if (!user) {
          return next(
            new HttpError('사용자를 찾을 수 없습니다.', 404, 'NOT_FOUND_USER')
          );
        }

        const jwtRefreshToken = await getTokenFromRedis(userId, 'jwtRefresh');

        verifyJwtToken(jwtRefreshToken, 'refresh');

        const newJwtAccessToken = generateJwtToken(userId, 'access');

        res.cookie('access_token', newJwtAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: JWT_CONFIG['access'].expirationSeconds * 1000,
          sameSite: 'strict',
        });

        res.status(200).send();
      } else {
        throw error;
      }
    }
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    } else {
      return next(
        new HttpError(
          'jwt 엑세스 토큰 갱신에 실패했습니다.',
          500,
          'FAILED_REFRESH_JWT_ACCESS_TOKEN'
        )
      );
    }
  }
};

export { createNickname, kakaoLogin, kakaoLogout, refreshJwtAccessToken };
