import { NextRequest, NextResponse } from "next/server";
import Auth from "@/app/models/auth";
import connectDB from "@/app/libs/mongodb";
import { verifyToken } from "@/app/utils/jwtUtils";
import Activity from "@/app/models/Activity";

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { postId } = await req.json();
    const decoded = verifyToken(req);
    const userID = decoded?._id;
    if (!userID) {
      return NextResponse.json(
        { message: "kullanıcı bulunamadı!" },
        { status: 404 }
      );
    }
    const user = await Auth.findById(userID);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }
    const activity = await Activity.findById(postId).select("subscribeUsers");
    if (!activity) {
      return NextResponse.json(
        { success: false, message: "Etkinlik bulunamadı" },
        { status: 404 }
      );
    }

    const isAlreadySaved = user && user.savedActivity.includes(postId);
    
    const updateUser = await Auth.findByIdAndUpdate(
      userID,
      isAlreadySaved
        ? { $pull: { savedActivity: postId } }
        : { $addToSet: { savedActivity: postId } },
      { new: true }
    );

  const updateActivity = await Activity.findByIdAndUpdate(
      postId,
      isAlreadySaved
        ? { $pull: { subscribeUsers: userID } }
        : { $addToSet: { subscribeUsers: userID } },
      { new: true }
    ).select("subscribeUsers");
 
    return NextResponse.json(
      {
        success: true,
        message: isAlreadySaved
          ? "Etkinlik kayıtlardan çıkarıldı"
          : "Etkinlik başarıyla kaydedildi",
           savedActivity: updateUser.savedActivity,
          subscribeUsers: updateActivity.subscribeUsers,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in saving activity:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Etkinlik kaydedilemedi",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  await connectDB();
  try {
    const decoded = verifyToken(req);
    const userID = decoded?._id;
    if (!userID) {
      return NextResponse.json(
        { message: "kullanıcı bulunamadı!" },
        { status: 404 }
      );
    }
    const user = await Auth.findById(userID).populate({
      path: "savedActivity",
      populate: {
        path: "creator",
        select: "name email profileImage",
      },
    });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, savedActivities: user.savedActivity },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in getting activity:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Etkinlik Getirilemedi",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
