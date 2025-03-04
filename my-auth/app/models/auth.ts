import mongoose from 'mongoose';
const AuthSchema = new mongoose.Schema({
name:{type:String,required:true},
email:{type:String,required:true,unique: true},
password:{type:String,required:true},
createdAt:{type:Date,default:Date.now}
});

export default mongoose.models.Auth || mongoose.model('Auth',AuthSchema);