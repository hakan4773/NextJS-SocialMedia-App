import mongoose from 'mongoose';
 export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  bio?: string;
  profileImage?: string;
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  posts: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
 } 

const AuthSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String },
    profileImage: { type: String },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    createdAt:{type:Date,default:Date.now}
});

export default mongoose.models.Auth || mongoose.model<IUser>('Auth',AuthSchema);