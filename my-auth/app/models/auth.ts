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
  surveys: mongoose.Types.ObjectId[];
  activities: mongoose.Types.ObjectId[];
  savedPosts: mongoose.Types.ObjectId[];
  savedActivity: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
 } 

const AuthSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String },
    profileImage: { type: String },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Auth" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "Auth" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    surveys: [{ type: mongoose.Schema.Types.ObjectId, ref: "Survey" }],
    activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    savedActivity: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
    createdAt:{type:Date,default:Date.now}
});

export default mongoose.models.Auth || mongoose.model<IUser>('Auth',AuthSchema);