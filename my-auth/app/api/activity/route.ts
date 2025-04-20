import connectDB from "@/app/libs/mongodb";
import { NextResponse,NextRequest } from "next/server";
import { verifyToken } from "@/app/utils/jwtUtils";
import Activity from "@/app/models/Activity";
import Auth from "@/app/models/auth";

export async function POST(req:NextRequest) {
const decoded=verifyToken(req);
  if (!decoded) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
  const { activityName, startDate , activityType, description,activityDate,createdAt  } = await req.json();
  if (!activityName || !activityType || !description || !startDate) {
    return NextResponse.json(
      { message: "Tüm alanlar (isim, tip, açıklama) zorunludur" },
      { status: 400 }
    );
  }
  try {
    await connectDB();
    const activity = await Activity.create({
      activityName, 
      activityType,
      description,
      startDate: new Date(startDate), 
      activityDate: activityDate || { hours: 0, minutes: 0 },
      createdAt,
      creator: decoded._id,
    });
     await  Auth.findByIdAndUpdate(
                  decoded._id,
                  { $push: { activities: activity._id } },
                  { new: true }
                );
    

    return NextResponse.json({message:"Etkinlik başarıyla oluşturuldu",activity}, { status: 201 });
  } catch (error:any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
    
}

export async function GET(req:NextRequest) {
  const decoded=verifyToken(req);
  if (!decoded) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
  try {
    await connectDB();
    const activities = await Activity.find({ creator: decoded._id }).sort({ createdAt: -1 }).populate("creator", "_id name  profileImage");

    return NextResponse.json({ activities }, { status: 200 });
  } catch (error:any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  
}