import jwt from "jsonwebtoken";
import Post from "@/app/models/Post";
import connectDB from "@/app/libs/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/app/utils/jwtUtils";

export async function POST(req: NextRequest) {
    await connectDB();
try{
         const decoded=verifyToken(req);
         if (!decoded) {
          return NextResponse.json({ message: "Invalid token" }, { status: 401 });
              }
        const { content, image, tags } = await req.json();
        const newPost = new Post({ content, image, tags, user: decoded.id }); 
        await newPost.save();

        return NextResponse.json({ message: "Post created successfully" }, { status: 201 });
    } catch (error: any) {
        console.error("Post creation error:", error.message);
        return NextResponse.json({ message: "Post creation failed", error: error.message }, { status: 500 });
    }
}

export async function GET(req:NextRequest) {
  await connectDB();
  try {
  const decoded = verifyToken(req);
  if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
  const posts = await Post.find({ user: decoded.id });
  console.log(decoded)
  if (!posts || posts.length === 0) {
    return NextResponse.json({ message: "Hiç post bulunamadı!" }, { status: 404 });
}
return NextResponse.json({ posts },{status:201})

  } catch (error:any) {
    return NextResponse.json({error:"Bir hata oluştu.",details:error.message},{status:500})
  }


}