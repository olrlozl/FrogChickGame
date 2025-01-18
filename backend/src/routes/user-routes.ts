import { Router } from 'express';
import {
  createUser,
  kakaoLogin,
  kakaoLogout,
} from '../controllers/user-controllers';

const userRouter = Router();

userRouter.post('/nickname', createUser);
userRouter.post('/login/kakao', kakaoLogin);
userRouter.post('/logout/kakao', kakaoLogout);

export default userRouter;
