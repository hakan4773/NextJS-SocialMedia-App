import connectDB from "@/app/libs/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Survey from "@/app/models/Survey";
import { verifyToken } from "@/app/utils/jwtUtils";

export async function POST(req: NextRequest) {
    await connectDB();
  try {
    const decoded = verifyToken(req);
     if (!decoded || !decoded.id) {
        return NextResponse.json({ error: "Yetkilendirme başarısız" }, { status: 401 });
      }
    const user = decoded?.id;

    const { question, choices, duration } = await req.json();
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
      choices,
      duration,
      creator: user,
    });

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
      const user = decoded?.id;
      if (!decoded) {
        return NextResponse.json({ error: "Yetkilendirme başarısız" }, { status: 401 });
      }
     const surveys = await Survey.find({ creator: user }).sort({ createdAt: -1 }).populate('creator', 'username avatar'); ;
return NextResponse.json({surveys},{status:200})
    }
    catch(error:any){
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}