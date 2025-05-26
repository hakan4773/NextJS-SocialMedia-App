import connectDB from "@/app/libs/mongodb";
import Auth from "@/app/models/auth";
import Notifications from "@/app/models/Notifications";
import Survey from "@/app/models/Survey";
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
        
        const surveys = await Survey.findById(postId);
        if (!surveys) {
          return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }
        const hasLiked = surveys.likes.includes(userId);
        if (hasLiked) {
            surveys.likes = surveys.likes.filter((like: string) => like.toString() !== userId);
        } else {
            surveys.likes.push(userId);
        }
        await surveys.save();
if (!hasLiked && surveys.creator.toString() !== userId) {
      const currentUser = await Auth.findById(userId);

      const notification = new Notifications({
        userId: surveys.creator,
        senderId: userId,
        message: `${currentUser?.name} gönderinizi beğendi.`,
        type: "like",
        postId: surveys._id,
      });

      await notification.save();
    }



        return NextResponse.json({
          message: hasLiked ? "Beğeni kaldırıldı" : "Beğenildi",
          likes: surveys.likes,
        });
    }

        catch (error: any) {
          console.error("Like error:", error.message);
          return NextResponse.json({ message: "Like failed", error: error.message }, { status: 500 });
        }
     
}