import { NextRequest, NextResponse } from "next/server";
import Auth from "../../models/auth";
import connectDB from "../../libs/mongodb";
import {User} from "../../types/user";
import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs";
interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}
export async function PUT(req:NextRequest){
await connectDB();
try {
    const { email, oldPassword, newPassword } = await req.json();

    const user=await Auth.findOne({email})
    if(!user){
    return  NextResponse.json({ message: "Kullanıcı bulunamadı" }, { status: 404 })
    }
    
    //eski şifreyi bulma
    const isMatch = await bcryptjs.compare(oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Eski şifre yanlış" }, { status: 400 });
    }
    //yeni şifreyi hashleme
    const hashedPassword=await bcryptjs.hash(newPassword,10)

    // Şifreyi güncelleme
    user.password = hashedPassword;
    await user.save();

return NextResponse.json({message:"Şifre güncelleme başarılı"}, { status: 200 })
} catch (error:any) {
    return  NextResponse.json({ message: "error" }, { status: 404 })
}
}

export async function GET(req:NextRequest) {
  await connectDB();
  try {
    const authHeader=req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ message: "Yetkisiz erişim!" }, { status: 401 });
  } 
  const token=authHeader.split(" ")[1];
  const decoded=jwt.verify(token,process.env.JWT_SECRET!) as DecodedToken;
  
  const user = await Auth.findById(decoded.id).select("-password");;  
  if (!user ) {
    return NextResponse.json({ message: "kullanıcı bulunamadı!" }, { status: 404 });
}
return NextResponse.json({ user },{status:201})

  } catch (error:any) {
    return NextResponse.json({error:"Bir hata oluştu.",details:error.message},{status:500})
  }


}