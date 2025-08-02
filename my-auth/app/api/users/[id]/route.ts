import Auth from "@/app/models/auth";
import connectDB from "@/app/libs/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Post from "@/app/models/Post";
import { verifyToken } from "@/app/utils/jwtUtils";
import Survey from "@/app/models/Survey";
import Activity from "@/app/models/Activity";

type Params = {
  params: {
    id: string;
  };
};
  
export async function GET(req: NextRequest, context: any) {
  await connectDB();

  try {
    const id = context?.params?.id;

    const user = await Auth.findById(id).select("-password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const posts = await Post.find({ user: id }).sort({ createdAt: -1 }).populate("user", "name email profileImage");
    const surveys = await Survey.find({ creator: id }).sort({ createdAt: -1 }).populate("creator", "name email profileImage");
    const activities = await Activity.find({ creator: id }).sort({ createdAt: -1 }).populate("creator", "name email profileImage");

      /*Oturum sahibi */
    const decoded = verifyToken(req);
    const loggedInUserId = decoded?._id;
    if (!loggedInUserId) {
      return NextResponse.json({ message: "User is not authenticated" }, { status: 401 });
    }

    const isFollowing = loggedInUserId
    ? user.followers.includes(loggedInUserId)
    : false;
 
    return NextResponse.json({
      user,
      posts, 
      surveys,
      activities,
      isFollowing, 
    });
  } catch (error: unknown) {
    console.error("Error occurred:", error);
  return NextResponse.json(
    { message: "Internal server error", error: (error as Error).message },
    { status: 500 }
    );
  }
}

