import { NextRequest, NextResponse } from "next/server";
import Auth from "@/app/models/auth";
import connectDB from "@/app/libs/mongodb";
import { verifyToken } from "@/app/utils/jwtUtils";

export async function POST(req:NextRequest) {
    await connectDB();
    try { 
      const decoded=verifyToken(req);
      const userID =decoded?.id
    if (!userID ) {
      return NextResponse.json({ message: "kullanıcı bulunamadı!" }, { status: 404 });
  }
  
  const { postId } = await req.json();
  if (!postId) {
  
    return NextResponse.json(
      { success: false, message: "Post ID gereklidir" },
      { status: 400 }
    );
  }
  
   const user = await Auth.findByIdAndUpdate(
    userID,
        { $addToSet: { savedPosts: postId } }, 
        { new: true }
      ).select("savedPosts");
  
      if (!user) {
        return NextResponse.json(
          { success: false, message: "Kullanıcı bulunamadı" },
          { status: 404 }
        );
      }
  
  
      // 4. Başarılı yanıt
      return NextResponse.json(
        {
          success: true,
          message: "Post başarıyla kaydedildi",
          savedPosts: user.savedPosts
        },
        { status: 200 }
      );
  
  
  
    } catch (error:any) {
      return NextResponse.json({error:"Bir hata oluştu.",details:error.message},{status:500})
    }
  
  
  }