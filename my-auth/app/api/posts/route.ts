import Post from "@/app/models/Post";
import connectDB from "@/app/libs/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/app/utils/jwtUtils";
import path from "path";
import fs, { existsSync } from 'fs';
import { writeFile } from "fs/promises";

export async function POST(req: NextRequest) {
    await connectDB();
     try{
         const decoded=verifyToken(req);
         if (!decoded) {
          return NextResponse.json({ message: "Invalid token" }, { status: 401 });
              }
        const formData = await req.formData();
        const content = formData.get("content")?.toString();
        const tagsEntry = formData.get("tags");
        const tags = tagsEntry && typeof tagsEntry === "string" ? JSON.parse(tagsEntry) : [];
        const image = formData.get("image") as File | null;

       if (!content) {
          return NextResponse.json({ message: "Content  is required" }, { status: 400 });
         }
    //Resim paylaşma bölümü
     const uploadDir = path.join(process.cwd(),"public/image")
    if(!existsSync(uploadDir)){
fs.mkdirSync(uploadDir,{recursive:true})
    }

    let imagePath = null;
   if(image){
    const filePath=path.join(uploadDir,image?.name)
    const fileBuffer =await image.arrayBuffer();
     await writeFile(filePath,Buffer.from(fileBuffer))

     imagePath = `/image/${image.name}`;
  }




        const newPost = new Post({ content,tags, image:image ? imagePath : null,  user: decoded.id }); 
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
  console.log(decoded)
  if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
  const posts = await Post.find({ user: decoded.id });
  if (!posts || posts.length === 0) {
    return NextResponse.json({ message: "Hiç post bulunamadı!" }, { status: 404 });
}
return NextResponse.json({ posts },{status:201})

  } catch (error:any) {
    return NextResponse.json({error:"Bir hata oluştu.",details:error.message},{status:500})
  }


}