import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routes/user-routes';
import rankRouter from './routes/rank-routes';
import playRouter from './routes/play-routes';

const app = express();

dotenv.config();

const MONGO_URL = process.env.MONGO_URL as string;
const SERVER_PORT = process.env.SERVER_PORT;

// 요청으로 json이 오면 일반적 데이터 구조(객체, 배열 등)으로 변환
app.use(bodyParser.json());

app.use('/api/user', userRouter);
app.use('/api/rank', rankRouter);
app.use('/api/play', playRouter);

// 에러 핸들링 미들웨어(위의 미들웨어 함수들 중 error가 발생하면 여기로 옴)
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  // 응답이 이미 전송된 경우
  if (res.headersSent) {
    return next(error); 
  }

  res.status(error.code || 500).json({
    message: error.message || '알 수 없는 에러가 발생했습니다.',
  });
});

// 데이터베이스 서버와 연결
mongoose
  .connect(MONGO_URL)
  .then(() => {
    // 백엔드 서버와 연결(5000번 포트)
    app.listen(SERVER_PORT);
  })
  .catch((err) => {
    console.log(err);
  });
