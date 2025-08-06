import Post from "@/app/models/Post";
import connectDB from "@/app/libs/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/app/utils/jwtUtils";
import path from "path";
import fs, { existsSync } from 'fs';
import Auth from "@/app/models/auth";
import Comment from "../../models/Comments";
import Notifications from "@/app/models/Notifications";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});
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
 
    let imagePath = null;
    if (image) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "posts" }, (error, result) => {
            if (error) reject(error);
            resolve(result);
          })
          .end(buffer);
      });

      imagePath = uploadResult.secure_url;
    }

    const newPost = new Post({
      content,
      tags,
      image: image ? imagePath : null,
      user: decoded._id,
    });
    await newPost.save();
    await Auth.findByIdAndUpdate(
      decoded._id,
      { $push: { posts: newPost._id } },
      { new: true }
    );

    const currentUser = await Auth.findById(decoded._id).populate("followers");
    for (const follower of currentUser.followers) {
      const notification = new Notifications({
        userId: follower._id,
        senderId: decoded._id,
        message: `${currentUser.name} yeni bir post paylaştı.`,
        type: "new_post",
        postId: newPost._id,
      });
      await notification.save();
    }
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


  
  const userBody=await Auth.findById( decoded._id).select("following");

  const userIds = [decoded._id, ...userBody.following];
  const posts = await Post.find({ user: { $in: userIds } }).sort({ createdAt: -1 }).populate("user", "name email profileImage");
  const Myposts = await Post.find({ user: decoded._id }).sort({ createdAt: -1 }).populate("user", "name email profileImage");
  
  if (!posts || posts.length === 0) {
  return NextResponse.json({ posts: [], Myposts: [] }, { status: 200 });
  }

return NextResponse.json({ posts, Myposts }, { status: 200 });


  } catch (error:any) {
    return NextResponse.json({error:"Bir hata oluştu.",details:error.message},{status:500})
  }


}
export async function DELETE(req: NextRequest) {
    await connectDB();
    try {
      const { postId } = await req.json();
        const decoded = verifyToken(req);
        if (!decoded) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }
        const post = await Post.findById(postId);
        if (!post) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }
        if (post.user.toString() !== decoded._id) {
            return NextResponse.json({ message: "You are not authorized to delete this post" }, { status: 403 });
        }
        // Resim dosyasını sil
  if (post.image) {
  const imagePath = path.join(process.cwd(), "public", post.image);
  console.log("Silinmek istenen resim:", imagePath);

  if (existsSync(imagePath)) {
    console.log("Dosya bulundu.");
    fs.unlinkSync(imagePath);
    console.log("Dosya silindi.");
  } else {
    console.log("Dosya bulunamadı.");
  }
}

                // 2. yorumları sil 
await Comment.deleteMany({ post: postId });
    // 3.postu sil 
        await Post.findByIdAndDelete(postId);
        // Kullanıcının post listesinden postu kaldır
            await Auth.findByIdAndUpdate(
          decoded._id,
          { $pull: { posts: postId } },
          { new: true }
        );

        return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });
} catch (error:any) {
        return NextResponse.json({ message: "Post deletion failed", error:error.message }, { status: 500 });
    }
}