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
}

const userSchema = new Schema<IUser>({
  nickname: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 6,
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
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
