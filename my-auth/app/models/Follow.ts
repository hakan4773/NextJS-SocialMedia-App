import mongoose, { Schema } from "mongoose";
interface IFollow extends Document {
  followerId: string;
  followingId: string;
}
const FollowSchema = new Schema(
  {
    followerId: {type: Schema.Types.ObjectId, ref: "Auth", required: true},
    followingId: {type: Schema.Types.ObjectId, ref: "Auth", required: true },
  },
  { timestamps: true }
);
const Follow = mongoose.models.Follow || mongoose.model<IFollow>("Follow", FollowSchema);
export default Follow;
