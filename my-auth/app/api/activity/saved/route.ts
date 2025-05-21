import { NextRequest, NextResponse } from "next/server";
import Auth from "@/app/models/auth";
import connectDB from "@/app/libs/mongodb";
import { verifyToken } from "@/app/utils/jwtUtils";

export async function POST(req:NextRequest) {
    await connectDB();
    try {
const { postId } = await req.json();
        const decoded=verifyToken(req);
        const userID = decoded?._id;
            if (!userID) {
              return NextResponse.json(
                { message: "kullanıcı bulunamadı!" },
                { status: 404 }
              );
            }
             const user = await Auth.findById(userID);
                if (!user) {
                  return NextResponse.json(
                    { success: false, message: "Kullanıcı bulunamadı" },
                    { status: 404 }
                  );
                }
        let updateUser;
        const isAlreadySaved = user && user.savedActivity.includes(postId);
        if(isAlreadySaved){
            updateUser = await Auth.findByIdAndUpdate(
                userID,
                { $pull: { savedActivity: postId } },
                { new: true }
              );
        }
        else{
            updateUser = await Auth.findByIdAndUpdate(
                userID,
                { $push: { savedActivity: postId } },
                { new: true }
              );
        }
   return NextResponse.json(
      {
        success: true,
        message: isAlreadySaved
          ? "Etkinlik kayıtlardan çıkarıldı"
          : "Etkinlik başarıyla kaydedildi",
        savedActivity: updateUser.savedActivity,
      },
      { status: 200 }
    );

    } catch (error:any) {
        console.error("Error in saving activity:", error);
        return NextResponse.json(
          { success: false, message: "Etkinlik kaydedilemedi" ,error: error.message},
          { status: 500 }
        );
      } 
    }

    export async function GET(req:NextRequest) {
        await connectDB();
        try {
            const decoded=verifyToken(req);
            const userID = decoded?._id;
            if (!userID) {
              return NextResponse.json(
                { message: "kullanıcı bulunamadı!" },
                { status: 404 }
              );
            }
             const user = await Auth.findById(userID).populate({
        path: 'savedActivity',
        populate: {
          path: 'creator',
          select: 'name email profileImage'
        }
      });
                if (!user) {
                  return NextResponse.json(
                    { success: false, message: "Kullanıcı bulunamadı" },
                    { status: 404 }
                  );
                }

               return NextResponse.json(
                    { success: true,savedActivities: user.savedActivity 
},  
                    { status: 200 }
                  );
        } catch (error:any) {
            console.error("Error in getting activity:", error);
            return NextResponse.json(
              { success: false, message: "Etkinlik Getirilemedi" ,error: error.message},
              { status: 500 }
            );
          }
        }
