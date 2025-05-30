import connectDB from "@/app/libs/mongodb";
import Auth from "@/app/models/auth";
import Notifications from "@/app/models/Notifications";
import Post from "@/app/models/Post";
import { verifyToken } from "@/app/utils/jwtUtils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
      await connectDB();
      try {
      const decoded = verifyToken(req);
     
      if (!decoded) {
          return NextResponse.json({ message: "Invalid token" }, { status: 401 });
      }
        const userId=decoded._id;
        const { postId } = await req.json();
        if (!postId) {
          return NextResponse.json({ message: "Post ID is required" }, { status: 400 });
        }
        
        const post = await Post.findById(postId)
        if (!post) {
          return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }
        const hasLiked = post.likes.includes(userId);
        if (hasLiked) {
          post.likes = post.likes.filter((like: string) => like.toString() !== userId);
        } else {
          post.likes.push(userId);
        }
        await post.save();
             

             if (!hasLiked && post.user.toString() !== userId) {
  const currentUser = await Auth.findById(userId); 

  const notification = new Notifications({
    userId: post.user,
    senderId: userId, 
    message: `${currentUser?.name} gönderinizi beğendi.`,
    type: "like",
    postId: post._id
  });
                 await notification.save();
               }


        return NextResponse.json({
          message: hasLiked ? "Beğeni kaldırıldı" : "Beğenildi",
          likes: post.likes,
        });
    
    
    
    }
        catch (error: any) {
          console.error("Like error:", error.message);
          return NextResponse.json({ message: "Like failed", error: error.message }, { status: 500 });
        }
     
}