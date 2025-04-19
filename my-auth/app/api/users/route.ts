import connectDB from "@/app/libs/mongodb";
import Auth from "@/app/models/auth";
import Post from "@/app/models/Post";
import {NextResponse } from "next/server";

export async function GET() {
   await connectDB();
   try {
    const users=await Auth.find();

      if (!users) {
        return NextResponse.json({ message: "Kullanıcı bulunamadı" });
      }
      const posts=await Post.find().populate("user","_id name profileImage email");

   return NextResponse.json({users,posts})

   } catch (error:any) {
    return NextResponse.json({details:error.message}, { status: 500 });
   } 
}