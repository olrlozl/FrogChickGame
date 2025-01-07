import HttpError from '../models/http-error';
import User from '../models/user';
import { NextFunction, Request, Response } from 'express';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { nickname } = req.body;

  let existingUser;
  try {
    // User collection에서 기준에 부합하는 document를 찾음
    existingUser = await User.findOne({ nickname });
  } catch (err) {
    const error = new HttpError('닉네임 생성에 실패했습니다.', 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError('이미 사용중인 닉네임입니다.', 409);
    return next(error);
  }

  const createdUser = new User({
    nickname,
  });

  try {
    // collection에 저장
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('유저 생성에 실패했습니다.', 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser });
};

export { createUser };
