import { NextRequest, NextResponse } from "next/server";
import Auth from "../../models/auth";
import connectDB from "../../libs/mongodb";
import bcryptjs from "bcryptjs";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";
import { UserType } from "@/app/types/user";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});
export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { name, email, password } = (await req.json()) as UserType;
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Please fill all fields" },
        { status: 400 }
      );
    }

    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcryptjs.hash(password, 12);
    const newUser = new Auth({
      name,
      email,
      password: hashedPassword,
      profileImage: "/image/profil.jpg",
    });
    await newUser.save();
    return NextResponse.json(
      { message: "User registered successfully", userId: newUser._id },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  await connectDB();
  try {
    const formData = await req.formData();
    const userId = formData.get("userId") as string;
    const file = formData.get("profileImage") as File | null;

    if (!userId || !file) {
      return NextResponse.json(
        { message: "Lütfen tüm alanları doldurun!" },
        { status: 400 }
      );
    }

    const user = await Auth.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }
   let imagePath = user.profileImage; 

    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "users" }, (error, result) => {
            if (error) reject(error);
            resolve(result);
          })
          .end(buffer);
      });

      imagePath = uploadResult.secure_url;
      user.profileImage = imagePath; 
    }


    await user.save();
    return NextResponse.json(
      {
        message: "Profil resmi başarıyla güncellendi",
        imageUrl: imagePath,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
