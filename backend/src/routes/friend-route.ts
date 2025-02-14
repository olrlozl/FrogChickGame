import { Router } from 'express';
import { searchFriend, applyFriend } from '../controllers/friend-controller';

const friendRouter = Router();

friendRouter.get('/search', searchFriend);
friendRouter.post('/apply', applyFriend);

export default friendRouter;
