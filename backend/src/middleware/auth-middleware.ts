import jwt, { JwtPayload } from 'jsonwebtoken';
import HttpError from '../models/http-error';
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

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
    return next(new HttpError('jwtAccessToken이 필요합니다.', 401));
  }

  try {
    // jwt 토큰 검증
    const jwtSecretKey = process.env.JWT_SECRET_KEY || 'default_secret_key';
    const decodedToken = jwt.verify(jwtAccessToken, jwtSecretKey);

    if (decodedToken && (decodedToken as JwtPayload).userId) {
      // 요청 객체(req)의 userId 속성에 디코딩된 토큰의 userId를 저장하여 이후 미들웨어에서 사용 가능하도록 설정
      req.userId = (decodedToken as JwtPayload).userId;
      return next();
    } else {
      return next(new HttpError('유효하지 않은 JWT 토큰입니다.', 401));
    }
  } catch (error) {
    return next(new HttpError('JWT 토큰 검증에 실패했습니다.', 400));
  }
};
export { checkAuth };
