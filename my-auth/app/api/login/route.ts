import Auth from "../../models/auth";
import connectDB from "../../libs/mongodb";
import {User} from "../../types/user";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
export async function POST(req:NextRequest) {
await connectDB();
try {
const {email,password}= await req.json() as User;

if(!email ||  !password){
return NextResponse.json({message: "Please fill all fields"},{status:400});
}

const user=await Auth.findOne({email});

if(!user){
return NextResponse.json({message: "User does not exist"},{status:400});
}



const isMatch=await bcryptjs.compare(password,user.password);
if(!isMatch){
return NextResponse.json({message: "wrong password"},{status:400});
}
const token =jwt.sign({
    id:user._id,
    email:user.email},
    process.env.JWT_SECRET as string,
    {
        expiresIn:"1h"
    }
)


return NextResponse.json({message: "User logged in successfully",token},{status:200});
}
catch (error: any) {
return NextResponse.json({error: error.message},{status:400});
}

}