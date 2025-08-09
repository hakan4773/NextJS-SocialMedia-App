import { NextResponse } from "next/server";
import connectDB from "@/app/libs/mongodb";
import Post from "../../../models/Post";

export async function GET() {
    await connectDB();
    try {
        const posts=await Post.find({},"tags")
        const tagCount: Record <string,number>={}
        posts.forEach(post=>{
            post.tags.forEach((tag: string) => {
            const cleanTag=tag.trim().toLowerCase();
                tagCount[cleanTag]=(tagCount[cleanTag] || 0) + 1;
            })

        })
            const sortedTags = Object.entries(tagCount)
             .sort((a, b) => b[1] - a[1])
              .map(([tag, count]) => ({ tag, count }));

         return NextResponse.json({ tags: sortedTags }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Bir hata oluştu", details: error.message },
      { status: 500 }
    );
  }

}