import connectDB from "@/app/libs/mongodb";
import { NextResponse,NextRequest } from "next/server";
import { verifyToken } from "@/app/utils/jwtUtils";
import Activity from "@/app/models/Activity";

export async function POST(req:NextRequest) {
const decoded=verifyToken(req);
  if (!decoded) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
  const { activityName, activityDate, activityType, description } = await req.json();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() + (activityDate.days || 0));
  startDate.setHours(startDate.getHours() + (activityDate.hours || 0));
  startDate.setMinutes(startDate.getMinutes() + (activityDate.minutes || 0));
  try {
    await connectDB();
    const activity = await Activity.create({
      activityName,
      activityDate,
      activityType,
      description,
      creator: decoded.id,
    });

    return NextResponse.json({message:"Etkinlik başarıyla oluşturuldu",activity}, { status: 201 });
  } catch (error:any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
    
}