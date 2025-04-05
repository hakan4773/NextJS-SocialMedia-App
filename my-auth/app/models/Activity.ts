import mongoose, { Document } from "mongoose";

export interface ActivityProps extends Document {
  activityName: string;
  activityType: string;
  description: string;
  creator: mongoose.Types.ObjectId;
  activityDate: {
    days:Number;
    hours: number;
    minutes: number;
  };
  isActive: boolean;
}
const ActivitySchema=new mongoose.Schema({
    activityName:{type:String,required:true},
    activityType:{type:String,required:true},
    description:{type:String,required:true},
    creator:{type:mongoose.Schema.Types.ObjectId,ref:'Auth',required:true},
    activityDate:{
      days: { type: Number, min: 0, max: 30, default: 0 },
      hours: { type: Number, min: 0, max: 23, default: 0 },
      minutes: { type: Number, min: 0, max: 59, default: 0 },
    },
    isActive: { type: Boolean, default: true },
})
export default mongoose.models.Activity || mongoose.model<ActivityProps>('Activity', ActivitySchema);
