import jwt from "jsonwebtoken";
import {NextResponse} from "next/server";

export async function POST(req:Request){
    const authHeader = req.headers.get("authorization");
        if(!authHeader){
    return NextResponse.json({ message: 'Yetkisiz erişim!' });
}
try {
    const token = authHeader.split(' ')[1];
    if (!token) {
        return NextResponse.json({ message: "Token eksik!" }, { status: 401 });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) 
      return NextResponse.json({ user: decoded, message: "Token geçerli" }, { status: 200 });
} catch (error:any) {
    console.error("Token verification error:", error.message);
    return NextResponse.json({ message: 'Geçersiz token' });

}


}