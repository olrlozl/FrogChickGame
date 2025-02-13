import mongoose, { Schema, Document } from 'mongoose';

type UserStateType = 'online' | 'offline' | 'playing';

interface IUser extends Document {
  nickname: string;
  kakaoId: number;
  socketId: string;
  wins: number;
  losses: number;
  rank: number;
  state: UserStateType;
  friends: mongoose.Types.ObjectId[];
  friendRequests: {
    sent: mongoose.Types.ObjectId[];
    received: mongoose.Types.ObjectId[];
  };
  revokedAt: Date;
}

const userSchema = new Schema<IUser>({
  nickname: {
    type: String,
    unique: true,
    minlength: 2,
    maxlength: 6,
    default: null,
  },
  kakaoId: { type: Number, required: true, unique: true },
  socketId: { type: String, unique: true },
  wins: { type: Number, required: true, default: 0 },
  losses: { type: Number, required: true, default: 0 },
  rank: { type: Number, default: null },
  state: { type: String, required: true, default: 'online' },
  friends: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    default: [],
  },
  friendRequests: {
    sent: {
      type: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
      default: [],
    },
    received: {
      type: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
      default: [],
    },
  },
  revokedAt: { type: Date, required: true, default: new Date(0) }, // 기본값(1970-01-01)이면 로그아웃한 적 없는 상태
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
