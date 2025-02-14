import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRouter from './routes/user-route';
import rankRouter from './routes/rank-route';
import playRouter from './routes/play-route';
import HttpError from './models/http-error';
import { checkAuth } from './middleware/auth-middleware';
import cookieParser from 'cookie-parser';
import friendRouter from './routes/friend-route';

const app = express();

dotenv.config();

const MONGO_URL = process.env.MONGO_URL as string;
const SERVER_PORT = process.env.SERVER_PORT;
const CLIENT_URL = process.env.CLIENT_URL as string;

// CORS 설정
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', CLIENT_URL);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use(express.json());

app.use(cookieParser(process.env.COOKIE_SECRET));

// 특정 API 제외하고 모든 요청에 checkAuth 적용
app.use((req: Request, res: Response, next: NextFunction) => {
  // 인증 없이 접근할 수 있는 API 경로
  const openPaths = ['/api/user/nickname', '/api/user/login/kakao'];

  if (openPaths.includes(req.path)) {
    return next(); // 인증 없이 바로 다음 미들웨어 실행
  }

  return checkAuth(req, res, next); // 인증 미들웨어 실행
});

app.use('/api/user', userRouter);
app.use('/api/friend', friendRouter);
app.use('/api/rank', rankRouter);
app.use('/api/play', playRouter);

// 에러 핸들링 미들웨어(위의 미들웨어 함수들 중 error가 발생하면 여기로 옴)
app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  // 응답이 이미 전송된 경우
  if (res.headersSent) {
    return next(error);
  }

  res.status(error.code || 500).json({
    message: error.message || '알 수 없는 에러가 발생했습니다.',
    errorType: error.type || 'UNKNOWN_ERROR_OCCURRED',
  });
});

// 데이터베이스 서버와 연결
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log('MongoDB 서버 연결 성공');
    // 백엔드 서버와 연결(5000번 포트)
    app.listen(SERVER_PORT);
  })
  .catch((error) => {
    console.error('MongoDB 연결 실패:', error);
  });
