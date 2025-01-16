import mongoose, { Schema, Document } from 'mongoose';

type UserStateType = 'online' | 'offline' | 'playing';

interface IUser extends Document {
  nickname: string;
  wins: number;
  losses: number;
  state: UserStateType;
  rank: number;
  friends: mongoose.Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
  nickname: { type: String, required: true, unique: true, minlength: 2, maxlength: 6 },
  wins: { type: Number, required: true, default: 0 },
  losses: { type: Number, required: true, default: 0 },
  state: { type: String, required: true, default: 'online' },
  rank: { type: Number, required: true, default: null },
  friends: [ { type: mongoose.Types.ObjectId, ref: 'User', default: []}]
})


const User = mongoose.model<IUser>('User', userSchema);
export default User;