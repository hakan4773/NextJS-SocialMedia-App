import { NextRequest, NextResponse } from "next/server";
import Auth from "../../models/auth";
import connectDB from "../../libs/mongodb";
import bcryptjs from "bcryptjs";
import { verifyToken } from "@/app/utils/jwtUtils";
import Post from "@/app/models/Post";
import Survey from "@/app/models/Survey";
import Activity from "@/app/models/Activity";
import Notifications from "@/app/models/Notifications";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});
export async function PUT(req: NextRequest) {
  await connectDB();

  try {
    const formData = await req.formData();
    const decoded = verifyToken(req);
    const userId=decoded?._id
    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;
    const oldPassword = formData.get("oldPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const file = formData.get("profileImage") as File | null;

    const user = await Auth.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

      if (!name || name.trim() === "") {
      return NextResponse.json(
        { message: "İsim alanı zorunludur" },
        { status: 400 }
      );
    }

    user.name = name;
    user.bio = bio;

    // Şifre güncellemesi yapılacaksa kontrol et
    if (newPassword) {
      if (!oldPassword) {
        return NextResponse.json({ message: "Eski şifre gerekli" }, { status: 400 });
      }
      const isMatch = await bcryptjs.compare(oldPassword, user.password);
      if (!isMatch) {
        return NextResponse.json({ message: "Eski şifre yanlış" }, { status: 400 });
      }
      const hashedPassword = await bcryptjs.hash(newPassword, 10);
      user.password = hashedPassword;
    }
    

    // Profil resmi varsa kaydet
    let imagePath = user.profileImage; 

    if (file) {

    if (user.profileImage) {
            try {
              const publicId = user.profileImage
                .split("/")
                .slice(-2)
                .join("/")
                .split(".")[0];

              await cloudinary.uploader.destroy(publicId);
            } catch (err) {
              console.error("Eski resim silinemedi:", err);
            }
          }

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
    message: "Profil başarıyla güncellendi",
    user: {
      _id: user._id,
      name: user.name,
      bio: user.bio,
      profileImage: user.profileImage,
      email: user.email,
    }
  },
  { status: 200 }
);

  } catch (error: any) {
    console.error("Güncelleme hatası:", error);
    return NextResponse.json(
      { message: "Sunucu hatası", details: error.message },
      { status: 500 }
    );
  }
}


export async function GET(req:NextRequest) {
  await connectDB();
  try { 
    const decoded=verifyToken(req);
    const user = await Auth.findById(decoded?._id);
    const posts = await Post.find({ user: decoded?._id }).populate('user', '_id name profileImage email');
    const surveys = await Survey.find({ creator: decoded?._id }).populate('creator', '_id name profileImage email');
    const activities = await Activity.find({ creator: decoded?._id }).populate('creator', '_id name profileImage email');
    const notifications=await Notifications.find({userId: decoded?._id});
  if (!user ) {
    return NextResponse.json({ message: "kullanıcı bulunamadı!" }, { status: 404 });
}
return NextResponse.json({ user, posts: posts || [] ,surveys,activities,notifications }, { status: 200 });

  } catch (error:any) {
    return NextResponse.json({error:"Bir hata oluştu.",details:error.message},{status:500})
  }


}
