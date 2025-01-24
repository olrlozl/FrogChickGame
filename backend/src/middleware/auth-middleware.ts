import { JwtPayload } from 'jsonwebtoken';
import HttpError from '../models/http-error';
import { verifyJwtToken } from '../utils/jwt-util';
import { NextFunction, Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string; // `userId`를 `Request` 타입에 추가
    }
  }
}

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

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
    // jwt 엑세스 토큰 검증
    const decodedToken = verifyJwtToken(jwtAccessToken);

    // 요청 객체(req)의 userId 속성에 디코딩된 토큰의 userId를 저장하여 이후 미들웨어에서 사용 가능하도록 설정
    req.userId = (decodedToken as JwtPayload).userId;

    return next();
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    } else {
      return next(
        new HttpError(
          'jwt 토큰 검증에 실패했습니다.',
          400,
          'FAILED_VERIFICATION_JWT_TOKEN'
        )
      );
    }
  }
};
export { checkAuth };
