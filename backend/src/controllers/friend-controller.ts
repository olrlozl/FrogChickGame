import HttpError from '../models/http-error';
import User from '../models/user';
import { NextFunction, Request, Response } from 'express';
import { validateNickname } from '../utils/validate';

const searchFriend = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId as string;
  const { nickname } = req.query;

  if (!nickname || typeof nickname !== 'string') {
    return next(
      new HttpError('nickname이 필요합니다.', 400, 'MISSING_NICKNAME')
    );
  }

  try {
    const user = await User.findById(userId).exec();
    if (!user) {
      return next(
        new HttpError('사용자를 찾을 수 없습니다.', 401, 'INVALID_USERID')
      );
    }

    if (nickname === user.nickname) {
      return next(
        new HttpError('본인은 검색할 수 없습니다.', 400, 'CANNOT_SEARCH_SELF')
      );
    }

    validateNickname(nickname);

    const searchedUser = await User.findOne({ nickname }).exec();
    if (!searchedUser) {
      return next(
        new HttpError('존재하지 않는 사용자입니다.', 404, 'UNKNOWN_USER')
      );
    }

    const isFriend = user.friends.includes(searchedUser._id);
    const isSent = user.friendRequests.sent.includes(searchedUser._id);

    res.json({
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
    const user = await User.findById(userId).exec();
    if (!user) {
      return next(
        new HttpError('사용자를 찾을 수 없습니다.', 401, 'INVALID_USERID')
      );
    }

    const toUser = await User.findOne({ nickname: to }).exec();
    if (!toUser) {
      return next(
        new HttpError('존재하지 않는 사용자입니다.', 404, 'UNKNOWN_USER')
      );
    }

    if (user.friends.includes(toUser._id)) {
      return next(new HttpError('이미 친구입니다.', 400, 'ALREADY_FRIEND'));
    }

    if (user.friendRequests.sent.includes(toUser._id)) {
      return next(
        new HttpError(
          '이미 친구 신청을 보냈습니다.',
          400,
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

export { searchFriend, applyFriend };
