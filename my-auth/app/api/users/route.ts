import connectDB from "@/app/libs/mongodb";
import Auth from "@/app/models/auth";
import {NextResponse } from "next/server";

export async function GET() {
   await connectDB();
   try {
    const users=await Auth.find();

      if (!users) {
        return NextResponse.json({ message: "Kullanıcı bulunamadı" });
      }

   return NextResponse.json({users})

   } catch (error:any) {
    return NextResponse.json({details:error.message}, { status: 500 });
   } 
}