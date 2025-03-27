import connectDB from "@/app/libs/mongodb";
import Auth from "@/app/models/auth";
import { verifyToken } from "@/app/utils/jwtUtils";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const decoded = verifyToken(req);
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    
    const followerId = decoded.id;
    const { followingId } = await req.json();

    const followerUser = await Auth.findById(followerId);
    const followingUser = await Auth.findById(followingId);
    if (!followerUser || !followingUser) {
      return NextResponse.json(
        { message: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

  
    /*Takipten çıkma işlemi */
    if (followerUser.following.includes(followingId)) {
     followerUser.following.pull(followingId);
     followingUser.followers.pull(followerId)
 await followerUser.save();
 await followingUser.save();
 return NextResponse.json(
  { message: "Takipten çıkıldı!", isFollowing: false },
  { status: 200 }
);
    }

 else {

    followerUser.following.push(followingId);
    followingUser.followers.push(followerId);
    await followerUser.save();
    await followingUser.save();
    return NextResponse.json(
      { message: "Takip edildi!", isFollowing:true},
      { status: 200 }
    );    

}

  } catch (error: any) {
    return NextResponse.json({ details: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await connectDB();
  try {
    const decoded = verifyToken(req);
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    //Burdan devam
  } catch (error: any) {
    return NextResponse.json({ details: error.message }, { status: 500 });
  }
}
