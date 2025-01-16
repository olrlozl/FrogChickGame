import { Router } from 'express';
import { createUser } from '../controllers/user-controllers';

const userRouter = Router();

userRouter.post('/', createUser);

export default userRouter;