import connectDB from "@/app/libs/mongodb";
import { NextResponse,NextRequest } from "next/server";
import { verifyToken } from "@/app/utils/jwtUtils";
import Activity from "@/app/models/Activity";
import Auth from "@/app/models/auth";
import path from "path";
import fs, { existsSync } from 'fs';
import Comment from "@/app/models/Comments";
import { writeFile } from "fs/promises";

export async function POST(req:NextRequest) {
  await connectDB();
const decoded=verifyToken(req);
  if (!decoded) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
  const formData = await req.formData();
  const activityName = formData.get("activityName")?.toString();
  const activityType = formData.get("activityType")?.toString();
  const description = formData.get("description")?.toString();
  const startDate = formData.get("startDate")?.toString();
  const activityDate = formData.get("activityDate");
  const image = formData.get("image") as File | null;

  try {
     //Resim paylaşma bölümü
       const uploadDir = path.join(process.cwd(),"public/image")
      if(!existsSync(uploadDir)){
  fs.mkdirSync(uploadDir,{recursive:true})
      }
  
      let imagePath = null;
     if(image){
      const filePath=path.join(uploadDir,image?.name)
      const fileBuffer =await image.arrayBuffer();
       await writeFile(filePath,Buffer.from(fileBuffer))
  
       imagePath = `/image/${image.name}`;
    }
    if (!activityName || !activityType || !description || !startDate) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }
    const activity = new Activity({
      activityName,
      activityType,
      description,
      startDate,
      activityDate: activityDate ? new Date(activityDate.toString()) : null,
      image: image ? imagePath : null,
      creator: decoded._id,
    });
    await activity.save();

    //  Kullanıcının etkinliklerini güncelle   
     await  Auth.findByIdAndUpdate(
                  decoded._id,
                  { $push: { activities: activity._id } },
                  { new: true }
                );
    

    return NextResponse.json({message:"Etkinlik başarıyla oluşturuldu",activity}, { status: 201 });
  } catch (error:any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
    
}

export async function GET(req:NextRequest) {
await connectDB();  

  try {
    const decoded=verifyToken(req);
  if (!decoded) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
    const userBody=await Auth.findById( decoded._id).select("following");
    const userIds = [decoded._id, ...userBody.following];

    const activities = await Activity.find({ creator: { $in: userIds } }).sort({ createdAt: -1 }).populate("creator", "_id name email profileImage");
     const Myactivity = await Activity.find({ creator: decoded._id }).sort({ createdAt: -1 }).populate("creator", "name email profileImage");
      
        if (!activities || activities.length === 0) {
           return NextResponse.json({ message: 'Aktif anket bulunamadı', surveys: [] },{status:200});
         }

    return NextResponse.json({ activities,Myactivity }, { status: 200 });
  } catch (error:any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  
}
export async function DELETE(req: NextRequest) {
    await connectDB();
    try {
      const { postId } = await req.json();
        const decoded = verifyToken(req);
        if (!decoded) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }
        const activity = await Activity.findById(postId);
        if (!activity) {
            return NextResponse.json({ message: "activity not found" }, { status: 404 });
        }
        if (activity.creator.toString() !== decoded._id) {
            return NextResponse.json({ message: "You are not authorized to delete this activity" }, { status: 403 });
        }
        // Resim dosyasını sil
  if (activity.image) {
  const imagePath = path.join(process.cwd(), "public", activity.image);
  if (existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  } else {
    console.log("Dosya bulunamadı.");
  }
}

                // 2. yorumları sil 
await Comment.deleteMany({ survey: postId });
    // 3.postu sil 
        await Activity.findByIdAndDelete(postId);
        // Kullanıcının etkinliklerini güncelle
        await Auth.findByIdAndUpdate(
          decoded._id,
          { $pull: { activities: postId } },
          { new: true }
        );
        return NextResponse.json({ message: "Activity deleted successfully" }, { status: 200 });
} catch (error:any) {
        return NextResponse.json({ message: "Activity deletion failed", error:error.message }, { status: 500 });
    }
}