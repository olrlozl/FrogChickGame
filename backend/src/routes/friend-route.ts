import { Router } from 'express';
import { searchFriend } from '../controllers/friend-controller';

const friendRouter = Router();

friendRouter.get('/search', searchFriend);

export default friendRouter;
