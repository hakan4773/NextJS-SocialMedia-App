import connectDB from "@/app/libs/mongodb";
import Comments from "@/app/models/Comments";
import Survey from "@/app/models/Survey";
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
        const survey = await Survey.findById(postId);
    
        if (!survey) {
        return NextResponse.json({ message: "Post bulunamadı" }, { status: 404 });
        }
        const newComment = await Comments.create({
            user: userId,
            survey: postId,
            content,
          });
          survey.comments.push(newComment._id);
          await survey.save();
    
        return NextResponse.json({ message: "Yorum eklendi", survey }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Yorum eklenirken hata oluştu",error }, { status: 500 });
    }
}