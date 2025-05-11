import mongoose, { Schema, Document } from "mongoose";
export interface IComment extends Document {
  user: mongoose.Types.ObjectId[];
  post: mongoose.Types.ObjectId;
  survey: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}
const CommentSchema: Schema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post"},
    survey: { type: mongoose.Schema.Types.ObjectId, ref: "Survey" },
    content: { type: String, required: true },
    createdAt:{ type: Date, default: Date.now },
  },
  { timestamps: true }
);
export default mongoose.models.Comment ||
  mongoose.model<IComment>("Comment", CommentSchema);
