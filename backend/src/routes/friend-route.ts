import { Router } from 'express';
import {
  searchFriend,
  applyFriend,
  getReceivedFriendList,
} from '../controllers/friend-controller';

const friendRouter = Router();

friendRouter.get('/search', searchFriend);
friendRouter.post('/apply', applyFriend);
friendRouter.get('/receipts', getReceivedFriendList);

export default friendRouter;
