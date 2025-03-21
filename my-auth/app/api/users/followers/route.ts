import connectDB from "@/app/libs/mongodb";
import { verifyToken } from "@/app/utils/jwtUtils";
import { NextResponse,NextRequest } from "next/server";


export async function POST(req:NextRequest) {
    await connectDB();
    try {
        const decoded=verifyToken(req);
        if (!decoded) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

    } catch (error:any) {
        return NextResponse.json({details:error.message});
    }
}