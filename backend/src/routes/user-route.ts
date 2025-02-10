import { Router } from 'express';
import {
  createNickname,
  kakaoLogin,
  kakaoLogout,
  refreshJwtAccessToken,
} from '../controllers/user-controller';
import { checkAuth } from '../middleware/auth-middleware';

const userRouter = Router();

userRouter.post('/nickname', createNickname);
userRouter.post('/login/kakao', kakaoLogin);
userRouter.post('/logout/kakao', kakaoLogout);
userRouter.post('/refresh/jwt-access-token', refreshJwtAccessToken);

export default userRouter;
