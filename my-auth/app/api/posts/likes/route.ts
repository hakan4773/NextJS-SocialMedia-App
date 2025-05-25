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
        
        const post = await Post.findById(postId);
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
     
             const currentUser = await Auth.findById(decoded._id).populate("following");
                for(const follow  of currentUser.following){
                 const notification=new Notifications({
        userId: follow._id ,
        senderId:decoded._id,
        message:`${currentUser.name} postunuzu beğendi.`,
        type:"like",
        postId:post._id
        
                 })
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