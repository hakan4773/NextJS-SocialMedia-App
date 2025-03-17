import { NextRequest, NextResponse } from "next/server";
import Auth from "../../models/auth";
import connectDB from "../../libs/mongodb";
import bcryptjs from "bcryptjs";
import {User} from "../../types/user";
import fs from 'fs';
import path from 'path';
import { writeFile } from "fs/promises";
export async function POST(req:NextRequest) {
    await connectDB();
    try {
const {name,email,password}= await req.json() as User;
if(!name || !email || !password){   
    return NextResponse.json({message: "Please fill all fields"},{status:400});
}

const existingUser=await Auth.findOne({email});
if(existingUser){
    return NextResponse.json({message: "User already exists"},{status:400});
}

const hashedPassword=await bcryptjs.hash(password,12);
    const newUser =  new Auth({name,email,password:hashedPassword, profileImage: "/image/profil.jpg"});
    await newUser.save();
    return NextResponse.json({message: "User registered successfully",userId: newUser._id},{status:201});

    } catch (error: any) {
        return NextResponse.json({error: error.message},{status:400});
    }

}
export async function PUT(req: NextRequest) {
    await connectDB();
    try {

        const formData = await req.formData(); 
        const userId = formData.get("userId") as string;
        const file = formData.get("profileImage") as File | null;

        if (!userId || !file) {
            return NextResponse.json({ message: "Lütfen tüm alanları doldurun!" }, { status: 400 });
        }

        const user = await Auth.findById(userId);
        if (!user) {
            return NextResponse.json({ message: "Kullanıcı bulunamadı" }, { status: 404 });
        }

    
        const uploadDir = path.join(process.cwd(), "public/image");
        console.log(uploadDir)
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filePath = path.join(uploadDir, file.name);

        const fileBuffer = await file.arrayBuffer();
        await writeFile(filePath, Buffer.from(fileBuffer));

        user.profileImage = `/image/${file.name}`;
        await user.save();
        console.log(filePath)
        return NextResponse.json({ 
            message: "Profil resmi başarıyla güncellendi", 
            imageUrl: user.profileImage 
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json(
          { message: "Internal Server Error", details: error.message },
          { status: 500 }
        );
      }
}