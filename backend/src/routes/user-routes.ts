import { Router } from 'express';
import {
  createUser,
  kakaoLogin,
  kakaoLogout,
  refreshJwtAccessToken,
} from '../controllers/user-controllers';
import { checkAuth } from '../middleware/auth-middleware';

const userRouter = Router();

userRouter.post('/nickname', createUser);
userRouter.post('/login/kakao', kakaoLogin);
userRouter.post('/logout/kakao', checkAuth, kakaoLogout); // 로그아웃 시 JWT 토큰 검증
userRouter.post('/refresh/jwt-access-token', refreshJwtAccessToken);

export default userRouter;
