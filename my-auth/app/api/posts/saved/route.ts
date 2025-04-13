import { NextRequest, NextResponse } from "next/server";
import Auth from "@/app/models/auth";
import connectDB from "@/app/libs/mongodb";
import { verifyToken } from "@/app/utils/jwtUtils";
import Post from "@/app/models/Post";

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const decoded = verifyToken(req);
    const userID = decoded?.id;
    if (!userID) {
      return NextResponse.json(
        { message: "kullanıcı bulunamadı!" },
        { status: 404 }
      );
    }

    const { postId } = await req.json();
    
    if (!postId) {
      return NextResponse.json(
        { success: false, message: "Post ID gereklidir" },
        { status: 400 }
      );
    }

    const user = await Auth.findById(userID);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    let updateUser;

    if (user.savedPosts.includes(postId)) {
      updateUser = await Auth.findByIdAndUpdate(
        userID,
        { $pull: { savedPosts: postId } },
        { new: true }
      ).select("savedPosts");
    } else {
      updateUser = await Auth.findByIdAndUpdate(
        userID,
        { $addToSet: { savedPosts: postId } },
        { new: true }
      ).select("savedPosts");
    }
    // 4. Başarılı yanıt
    return NextResponse.json(
      {
        success: true,
        message: user.savedPosts.includes(postId)
          ? "Post kayıtlardan çıkarıldı"
          : "Post başarıyla kaydedildi",
        savedPosts: updateUser.savedPosts,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Bir hata oluştu.", details: error.message },
      { status: 500 }
    );
  }
}
export async function GET(req: NextRequest) {
  await connectDB();
  try {
    const decoded = verifyToken(req);
    const userID = decoded?.id;
    if (!userID) {
      return NextResponse.json(
        { message: "kullanıcı bulunamadı!" },
        { status: 404 }
      );
    }
    const user = await Auth.findById(userID).populate({
      path: "savedPosts",
      populate: {
        path: "user",
        select: "name email profileImage"
      }
    });
    if (!user) {
      return NextResponse.json(
        { message: "Kullanıcı bulunamadı!" },
        { status: 404 }
      );
    }
    const savedPosts = user.savedPosts;

    return NextResponse.json(
      {
        posts: savedPosts
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Bir hata oluştu.", details: error.message },
      { status: 500 }
    );
  }
}
