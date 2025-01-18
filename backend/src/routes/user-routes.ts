import { Router } from 'express';
import { createUser, kakaoLogin } from '../controllers/user-controllers';

const userRouter = Router();

userRouter.post('/nickname', createUser);
userRouter.post('/login/kakao', kakaoLogin);

export default userRouter;
