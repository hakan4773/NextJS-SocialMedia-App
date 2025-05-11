import mongoose, { Schema, Document } from "mongoose";
export interface Choice {
    text: string;
    voters: mongoose.Types.ObjectId[];
  }
export interface SurveyProps extends Document{
question:string;
choices:Choice[];
duration:{
    days:number;
    hours:number;
    minutes:number;
}
creator:mongoose.Types.ObjectId;
likes: mongoose.Types.ObjectId[];
comments: mongoose.Types.ObjectId[];
endDate:Date;
isActive: boolean;
createdAt:Date;
} 
const SurveySchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    choices: [{
        text: { type: String, required: true },
        voters: [{ type: Schema.Types.ObjectId, ref: 'Auth' }]
      }],
    duration: {
      days: { type: Number, min: 0, max: 30, default: 0 },
      hours: { type: Number, min: 0, max: 23, default: 0 },
      minutes: { type: Number, min: 0, max: 59, default: 0 },
    },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Auth" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    endDate: { type: Date },
    createdAt:{ type: Date },
   isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Survey || mongoose.model<SurveyProps>('Survey', SurveySchema);

