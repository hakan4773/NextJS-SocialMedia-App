import Auth from "@/app/models/auth";
import connectDB from "@/app/libs/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const { id } = params;

    const user = await Auth.findById(id).select("-password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({
      user
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}