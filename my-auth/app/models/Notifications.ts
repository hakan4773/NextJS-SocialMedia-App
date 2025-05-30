import mongoose, { Document } from "mongoose";
export interface INotification extends Document{
userId:mongoose.Types.ObjectId
senderId:mongoose.Types.ObjectId
postId:mongoose.Types.ObjectId
type:string,
message:string,
createdAt:Date
}
const NotificationSchema=new  mongoose.Schema({
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "Auth",required: true },
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: "Auth" },
      postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
      type: { type: String, enum: ["like", "comment", "follow", "new_post","new_survey"], required: true },
      message:{type:String,required:true},
      createdAt:{type:Date, default:Date.now}

})
export default mongoose.models.Notifications || mongoose.model<INotification>("Notifications",NotificationSchema)