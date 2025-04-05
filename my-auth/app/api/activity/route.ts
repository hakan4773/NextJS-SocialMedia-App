import connectDB from "@/app/libs/mongodb";
import { NextResponse,NextRequest } from "next/server";
import { verifyToken } from "@/app/utils/jwtUtils";
import Activity from "@/app/models/Activity";

export async function POST(req:NextRequest) {
const decoded=verifyToken(req);
  if (!decoded) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
  const { activityName, startDate , activityType, description,activityDate  } = await req.json();
  if (!activityName || !activityType || !description || !startDate) {
    return NextResponse.json(
      { message: "Tüm alanlar (isim, tip, açıklama) zorunludur" },
      { status: 400 }
    );
  }
  const parsedDate = new Date();

  try {
    await connectDB();
    const activity = await Activity.create({
      activityName, 
      activityType,
      description,
      startDate: new Date(startDate), 
      activityDate: activityDate || { hours: 0, minutes: 0 },
     
      creator: decoded.id,
    });

    return NextResponse.json({message:"Etkinlik başarıyla oluşturuldu",activity}, { status: 201 });
  } catch (error:any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
    
}