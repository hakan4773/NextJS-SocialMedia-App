import { NextRequest, NextResponse } from "next/server";
import Auth from "../../models/auth";
import connectDB from "../../libs/mongodb";
import bcryptjs from "bcryptjs";

export async function POST(req:NextRequest) {
    await connectDB();
    try {
const {name,email,password}= await req.json();

const existingUser=await Auth.findOne({email});
if(existingUser){
    return NextResponse.json({message: "User already exists"},{status:400});
}
const hashedPassword=await bcryptjs.hash(password,12);
    const newUser =  new Auth({name,email,password:hashedPassword});
    await newUser.save();
    return NextResponse.json({message: "User registered successfully"},{status:201});

    } catch (error: any) {
        return NextResponse.json({error: error.message},{status:400});
    }

}