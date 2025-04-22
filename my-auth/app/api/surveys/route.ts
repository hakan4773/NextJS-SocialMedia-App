import connectDB from "@/app/libs/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Survey from "@/app/models/Survey";
import { verifyToken } from "@/app/utils/jwtUtils";
import Auth from "@/app/models/auth";

export async function POST(req: NextRequest) {
    await connectDB();
  try {
    const decoded = verifyToken(req);   
     const user = decoded?._id;
     if (!decoded || !user) {
        return NextResponse.json({ error: "Yetkilendirme başarısız" }, { status: 401 });
      }

    const { question, choices, duration } = await req.json();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (duration.days || 0));
    endDate.setHours(endDate.getHours() + (duration.hours || 0));
    endDate.setMinutes(endDate.getMinutes() + (duration.minutes || 0));
    
    if (!question || !choices || !duration) {
        return NextResponse.json(
          { error: "Eksik alanlar var" },
          { status: 400 }
        );
      }

      if(choices.length < 2 ){
        return NextResponse.json({ error: "En az 2 seçenek eklemelisiniz" },
            { status: 400 })
      }
    const survey = await Survey.create({
      question,
      choices: choices.map((choice: string) => ({ text: choice, voters: [] })),
      duration,
      creator: user,
      endDate
    });
      await Auth.findByIdAndUpdate(
              decoded._id,
              { $push: { surveys: survey._id } },
              { new: true }
            );

    return NextResponse.json({
      message: "Anket başarıyla oluşturuldu",
      survey,
    },{ status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message },{ status: 500 }
    );
  }
}
export async function GET(req: NextRequest) {
    await connectDB();
    try {
      const decoded = verifyToken(req);
      const user = decoded?._id;
      if (!decoded) {
        return NextResponse.json({ error: "Yetkilendirme başarısız" }, { status: 401 });
      }
     const surveys = await Survey.find({ creator: user,isActive: true }).sort({ createdAt: -1 }).populate('creator', '_id name email profileImage'); ;
     if (!surveys.length) {
      return NextResponse.json({ message: 'Aktif anket bulunamadı', surveys: [] },{status:400});
    }

     return NextResponse.json({surveys},{status:200})
    }
    catch(error:any){
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}