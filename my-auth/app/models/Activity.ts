import { create } from "domain";
import mongoose, { Document } from "mongoose";

export interface ActivityProps extends Document {
  activityName: string;
  activityType: string;
  description: string;
  creator: mongoose.Types.ObjectId;
  activityDate: {
    hours: number;
    minutes: number;
  };
  startDate: Date;
  isActive: boolean;
  createdAt:Date;
}
const ActivitySchema=new mongoose.Schema({
    activityName:{type:String,required:true},
    activityType:{type:String,required:true},
    description:{type:String,required:true},
    creator:{type:mongoose.Schema.Types.ObjectId,ref:'Auth',required:true},
    activityDate:{
      hours: { type: Number, min: 0, max: 23, default: 0 },
      minutes: { type: Number, min: 0, max: 59, default: 0 },
    },
    startDate: { type: Date, required: true },
        isActive: { type: Boolean, default: true },
        createdAt:{type:Date,default:Date.now}
})
export default mongoose.models.Activity || mongoose.model<ActivityProps>('Activity', ActivitySchema);
