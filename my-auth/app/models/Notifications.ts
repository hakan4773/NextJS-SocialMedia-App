import mongoose, { Document } from "mongoose";
export interface INotification extends Document{
user:mongoose.Types.ObjectId
notification:string,
createdAt:Date
}
const NotificationSchema=new  mongoose.Schema({
      user: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true },
      notification:{type:String,required:true},
      createdAt:{type:Date, default:Date.now}

})
export default mongoose.models.Notifications || mongoose.model<INotification>("Notifications",NotificationSchema)