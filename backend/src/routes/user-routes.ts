import { Router } from 'express';
import { createUser } from '../controllers/user-controllers';

const userRouter = Router();

userRouter.post('/nickname', createUser);

export default userRouter;
