import HttpError from '../models/http-error';
import User from '../models/user';
import {
  getKakaoTokens,
  getKakaoTokenInfo,
  logoutKakao,
  refreshKakaoAccessToken,
  storeKakaoTokenInRedis,
  getKakaoTokenFromRedis,
  removeTokensFromRedis,
  storeJwtRefreshTokenInRedis,
  getJwtRefreshTokenFromRedis,
} from '../services/user-service';
import { NextFunction, Request, Response } from 'express';
import {
  generateJwtToken,
  getUserIdFromJwtAccessToken,
  verifyJwtToken,
} from '../utils/jwt-util';

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
    // userId에 해당하는 사용자 조회
    const user = await User.findById(userId);

    // userId에 해당하는 사용자가 없을 경우
    if (!user) {
      return next(
        new HttpError('사용자를 찾을 수 없습니다.', 404, 'NOT_FOUND_USER')
      );
    }

    // 이미 닉네임이 있을 경우
    if (user.nickname) {
      return next(
        new HttpError(
          '이미 닉네임을 생성한 이력이 있습니다.',
          409,
          'ALREADY_EXISTS_NICKNAME'
        )
      );
    }

    // 닉네임 유효성 검사
    const nicknameRegex = /^[가-힣a-zA-Z]{2,6}$/;
    if (!nicknameRegex.test(nickname)) {
      return next(
        new HttpError(
          '닉네임은 한글, 영어 2~6자만 입력 가능합니다.',
          422,
          'INVALID_NICKNAME'
        )
      );
    }

    // 닉네임 중복 확인
    const existingNickname = await User.findOne({ nickname });
    if (existingNickname) {
      return next(
        new HttpError('이미 사용중인 닉네임입니다.', 409, 'DUPLICATED_NICKNAME')
      );
    }

    // 닉네임 지정
    user.nickname = nickname;

    // 사용자 정보 저장
    await user.save();

    // jwt 엑세스 토큰 발급
    const jwtAccessToken = generateJwtToken(
      { userId: user.id, revokedAt: user.revokedAt },
      'access'
    );

    // jwt 리프레시 토큰 발급
    const jwtRefreshToken = generateJwtToken(
      { userId: user.id, revokedAt: user.revokedAt },
      'refresh'
    );

    // redis에 jwt 리프레시 토큰 저장
    await storeJwtRefreshTokenInRedis(user.id, jwtRefreshToken);

    // jwt 엑세스 토큰을 HttpOnly, Secure 쿠키로 설정
    res.cookie('access_token', jwtAccessToken, {
      httpOnly: true, // 클라이언트에서 JavaScript로 쿠키 접근 불가
      secure: process.env.NODE_ENV === 'production', // 프로덕션 환경에서만 Secure 플래그 설정
      maxAge: 1000 * 60 * 60, // 1시간 동안 유효
      sameSite: 'strict', // CSRF 방지
    });

    // 닉네임 생성 성공 응답
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
    // 카카오 API에서 인가 코드로 액세스 토큰과 리프레시 토큰 받기
    const {
      kakaoAccessToken,
      kakaoRefreshToken,
      kakaoAccessTokenExpirationTime,
      kakaoRefreshTokenExpirationTime,
    } = await getKakaoTokens(redirectUri, code);

    // 카카오 API에서 카카오 ID 조회
    const { kakaoId } = await getKakaoTokenInfo(kakaoAccessToken);

    // 이미 가입한 사용자인지 확인
    const signedupUser = await User.findOne({ kakaoId });

    // 1. 이미 가입했고, 닉네임도 있는 경우 => jwt 토큰 발급 후 반환
    if (signedupUser && signedupUser.nickname) {
      // jwt 엑세스 토큰 발급
      const jwtAccessToken = generateJwtToken(
        {
          userId: signedupUser.id,
          revokedAt: signedupUser.revokedAt,
        },
        'access'
      );

      // jwt 리프레시 토큰 발급
      const jwtRefreshToken = generateJwtToken(
        {
          userId: signedupUser.id,
          revokedAt: signedupUser.revokedAt,
        },
        'refresh'
      );

      // redis에 jwt 리프레시 토큰 저장
      await storeJwtRefreshTokenInRedis(signedupUser.id, jwtRefreshToken);

      // redis에 카카오 액세스 토큰 저장
      await storeKakaoTokenInRedis(
        signedupUser.id,
        kakaoAccessToken,
        kakaoAccessTokenExpirationTime,
        'access'
      );

      // redis에 카카오 리프레시 토큰 저장
      await storeKakaoTokenInRedis(
        signedupUser.id,
        kakaoRefreshToken,
        kakaoRefreshTokenExpirationTime,
        'refresh'
      );

      // jwt 엑세스 토큰을 HttpOnly, Secure 쿠키로 설정
      res.cookie('access_token', jwtAccessToken, {
        httpOnly: true, // 클라이언트에서 JavaScript로 쿠키 접근 불가
        secure: process.env.NODE_ENV === 'production', // 프로덕션 환경에서만 Secure 플래그 설정
        maxAge: 1000 * 60 * 60, // 1시간 동안 유효
        sameSite: 'strict', // CSRF 방지
      });

      // 카카오 로그인 성공 응답 (닉네임 이미 있는 경우)
      res.status(200).send();
    }
    // 2. 이미 가입했지만, 닉네임이 없는 경우 => userId 반환
    else if (signedupUser && !signedupUser.nickname) {
      // 카카오 로그인 성공 응답 (닉네임 없는 경우)
      res.status(200).json({
        userId: signedupUser.id,
      });
    }
    // 3. 최초 로그인한 신규 회원일 경우 => 사용자 생성 후, userId 반환
    else {
      // 새로운 사용자 생성
      const createdUser = new User({
        kakaoId,
      });

      // 사용자 정보 저장
      await createdUser.save();

      // redis에 카카오 액세스 토큰 저장
      await storeKakaoTokenInRedis(
        createdUser.id,
        kakaoAccessToken,
        kakaoAccessTokenExpirationTime,
        'access'
      );

      // redis에 카카오 리프레시 토큰 저장
      await storeKakaoTokenInRedis(
        createdUser.id,
        kakaoRefreshToken,
        kakaoRefreshTokenExpirationTime,
        'refresh'
      );

      // 카카오 로그인 성공 응답 (닉네임 없는 경우)
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
  const userId = req.userId;

  if (!userId) {
    return next(
      new HttpError('유효한 사용자 정보가 필요합니다.', 400, 'MISSING_USER_ID')
    );
  }

  try {
    // reids에서 카카오 액세스 토큰 조회
    let kakaoAccessToken = await getKakaoTokenFromRedis(userId, 'access');

    // 카카오 엑세스 토큰이 만료되었을 경우, 갱신
    try {
      getKakaoTokenInfo(kakaoAccessToken);
    } catch (error) {
      // 카카오 엑세스 토큰이 만료된 경우!
      if (
        error instanceof HttpError &&
        error.type === 'EXPIRED_KAKAO_ACCESS_TOKEN'
      ) {
        // reids에서 카카오 리프레시 토큰 조회
        const kakaoRefreshToken = await getKakaoTokenFromRedis(
          userId,
          'refresh'
        );

        // 카카오 엑세스 토큰 갱신
        const { newKakaoAccessToken, newKakaoAccessTokenExpirationTime } =
          await refreshKakaoAccessToken(kakaoRefreshToken);

        // redis에 새로운 카카오 액세스 토큰 저장
        await storeKakaoTokenInRedis(
          userId,
          newKakaoAccessToken,
          newKakaoAccessTokenExpirationTime,
          'access'
        );

        // 새로운 카카오 엑세스 토큰 할당
        kakaoAccessToken = newKakaoAccessToken;
      }
    }

    // 카카오 로그아웃
    await logoutKakao(kakaoAccessToken);

    // redis에서 토큰 삭제
    await removeTokensFromRedis(userId);

    // revokedAt 필드 현재 시간으로 갱신
    await User.findByIdAndUpdate(userId, {
      revokedAt: new Date(),
    });

    // 카카오 로그아웃 성공 시
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
      // jwt 엑세스 토큰이 만료된 경우!
      if (error instanceof HttpError && error.type === 'EXPIRED_JWT_TOKEN') {
        // 만료된 jwt 엑세스 토큰의 payload에서 userId 추출
        const userId = getUserIdFromJwtAccessToken(jwtAccessToken);
        console.log(userId + ' userid');

        // userId에 해당하는 사용자 조회
        const user = await User.findById(userId);

        // userId에 해당하는 사용자가 없을 경우
        if (!user) {
          return next(
            new HttpError('사용자를 찾을 수 없습니다.', 404, 'NOT_FOUND_USER')
          );
        }

        // redis에서 jwt 리프레시 토큰 조회
        const jwtRefreshToken = await getJwtRefreshTokenFromRedis(userId);

        // jwt 리프레시 토큰 검증
        verifyJwtToken(jwtRefreshToken, 'refresh');

        // 새로운 jwt 엑세스 토큰 발급
        const newJwtAccessToken = generateJwtToken(
          { userId, revokedAt: user.revokedAt },
          'access'
        );

        // jwt 엑세스 토큰 갱신에 성공 시
        res.status(200).json({ newJwtAccessToken });
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
