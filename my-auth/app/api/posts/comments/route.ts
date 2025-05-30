import connectDB from "@/app/libs/mongodb";
import Auth from "@/app/models/auth";
import Comments from "@/app/models/Comments";
import Notifications from "@/app/models/Notifications";
import Post from "@/app/models/Post";
import { verifyToken } from "@/app/utils/jwtUtils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
await connectDB();
try {  
    const { postId, content } = await req.json();
    const decoded=verifyToken(req);
    const userId = decoded?._id;
    
    if (!userId) {
        return NextResponse.json({ message: "Geçersiz token" }, { status: 401 });
    }
    if (!content) {
        return NextResponse.json({ message: "Mesaj boş olamaz" }, { status: 401 });
    }
        const post = await Post.findById(postId);
    
        if (!post) {
        return NextResponse.json({ message: "Post bulunamadı" }, { status: 404 });
        }
        const newComment = await Comments.create({
            user: userId,
            post: postId,
            content,
          });
          post.comments.push(newComment._id);
          await post.save();


        if (newComment && post.user.toString() !== userId) {
          const currentUser = await Auth.findById(userId).select("name");
          const notification = new Notifications({
            userId: post.user,
            senderId: userId,
            message: `${currentUser?.name} gönderinize yorum yaptı.`,
            type: "comment",
            postId: post._id,
          });
          await notification.save();
        }

    
        return NextResponse.json({ message: "Yorum eklendi", post }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Yorum eklenirken hata oluştu",error }, { status: 500 });
    }
}
export async function GET(req: NextRequest) {
    await connectDB();
    try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
            const decoded=verifyToken(req);
        const userId = decoded?._id;
        
        if (!userId) {
            return NextResponse.json({ message: "Geçersiz token" }, { status: 401 });
        }
        const post = await Post.findById(postId).populate({
  path: "comments",
  populate: { path: "user", select: "name profileImage"  } 
});
    
        if (!post) {
            return NextResponse.json({ message: "Post bulunamadı" }, { status: 404 });
        }
    
        return NextResponse.json({ message: "Yorumlar alındı", comments:post.comments }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Yorumlar alınırken hata oluştu", error }, { status: 500 });
    }
}
