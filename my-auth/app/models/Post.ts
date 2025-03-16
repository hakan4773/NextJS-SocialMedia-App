import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
    user: mongoose.Types.ObjectId;
    content: string;
    image?: string;
    tags: string[];
    likes: mongoose.Types.ObjectId[];
    comments: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
  }

const PostSchema: Schema = new Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      content: { type: String, required: true },
      image: { type: String },
      tags: [{ type: String }],
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
      comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    },
    { timestamps: true }
  );
  export default mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);