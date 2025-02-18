import HttpError from '../models/http-error';
import User from '../models/user';
import { NextFunction, Request, Response } from 'express';
import { validateNickname } from '../utils/validate';
import { findUserById } from '../services/user-service';

const searchFriend = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId as string;
  const { nickname } = req.query;

  if (!nickname) {
    return next(
      new HttpError('nickname이 필요합니다.', 400, 'MISSING_NICKNAME')
    );
  }

  try {
    validateNickname(nickname);

    const user = await findUserById(userId);

    if (nickname === user.nickname) {
      return next(
        new HttpError('본인은 검색할 수 없습니다.', 400, 'CANNOT_SEARCH_SELF')
      );
    }

    const searchedUser = await User.findOne({ nickname });
    if (!searchedUser) {
      return next(
        new HttpError('존재하지 않는 사용자입니다.', 404, 'UNKNOWN_USER')
      );
    }

    const isFriend = user.friends.includes(searchedUser._id);
    const isSent = user.friendRequests.sent.includes(searchedUser._id);

    res.status(200).json({
      nickname,
      wins: searchedUser.wins,
      losses: searchedUser.losses,
      isSent,
      isFriend,
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    } else {
      return next(
        new HttpError('친구 검색에 실패했습니다.', 500, 'FAILED_SEARCH_USER')
      );
    }
  }
};

const applyFriend = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId as string;
  const { to } = req.body;

  try {
    const user = await findUserById(userId);

    const toUser = await User.findOne({ nickname: to });
    if (!toUser) {
      return next(
        new HttpError('존재하지 않는 사용자입니다.', 404, 'UNKNOWN_USER')
      );
    }

    if (user.friends.includes(toUser._id)) {
      return next(new HttpError('이미 친구입니다.', 409, 'ALREADY_FRIEND'));
    }

    if (user.friendRequests.sent.includes(toUser._id)) {
      return next(
        new HttpError(
          '이미 친구 신청을 보냈습니다.',
          409,
          'ALREADY_APPLY_FRIEND'
        )
      );
    }

    user.friendRequests.sent.push(toUser._id);
    toUser.friendRequests.received.push(user._id);

    await user.save();
    await toUser.save();

    res.status(200).send();
  } catch (error) {
    return next(
      new HttpError('친구 신청에 실패했습니다.', 500, 'FAILED_APPLY_FRIEND')
    );
  }
};

const getReceivedFriendList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId as string;

    const user = await User.findById(userId).populate(
      'friendRequests.received',
      'nickname'
    );

    if (!user) {
      return next(
        new HttpError('사용자를 찾을 수 없습니다.', 401, 'INVALID_USERID')
      );
    }

    const receivedList = user.friendRequests.received.map((friend: any) => ({
      nickname: friend.nickname,
    }));

    res.status(200).json({ receivedList });
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    } else {
      return next(
        new HttpError(
          '친구 신청 목록 조회에 실패했습니다.',
          500,
          'FAILED_GET_RECEIVED_FRIEND_LIST'
        )
      );
    }
  }
};

export { searchFriend, applyFriend, getReceivedFriendList };
