import connectDB from "@/app/libs/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Survey from "@/app/models/Survey";
import { verifyToken } from "@/app/utils/jwtUtils";
interface VoteRequest {
  surveyId: string;
  choiceIndex: number;
}

interface Choice {
  voters: string[];
}
export async function POST(req: NextRequest) {
    await connectDB();
  try {
    const decoded = verifyToken(req);
     if (!decoded || !decoded.id) {
        return NextResponse.json({ error: "Yetkilendirme başarısız" }, { status: 401 });
      }
    const user = decoded?.id;

    const { surveyId, choiceIndex }:VoteRequest = await req.json();
    if (!surveyId || choiceIndex === undefined) {
      return NextResponse.json(
        { error: "Survey ID and choice index are required" },
        { status: 400 }
      );
    }
    //Anketi bul
    const survey = await Survey.findById(surveyId);
    if (!survey) {
        return NextResponse.json({ error: "Anket bulunamadı" }, { status: 404 });
      }
     //Anket aktif mi değil mi kontrol et
    const now=new Date();
    if(!survey.isActive || survey.endDate <now){
      return NextResponse.json({ message: "Bu anket kapalı" }, { status: 404 });
    }


       //Kullanıcı zaten oy kullanmışsa 
      const alreadyVoted = survey.choices.some((vote: Choice) => vote.voters.includes(user)
      );
      if (alreadyVoted) {
        return NextResponse.json({ error: "Bu ankete zaten oy verdiniz" }, { status: 400 });
      }
  //
      survey.choices[choiceIndex].voters.push(user);
      await survey.save();

      return NextResponse.json({ message: "Oyunuz kaydedildi", survey }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message },{ status: 500 }
    );
  }
}