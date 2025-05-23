"use client";
import React, { useEffect, useState } from "react";
import LeftBar from "./components/LeftBar";
import RightBar from "./components/RightBar";
import Posts from "./components/Posts";
import PostCreation from "./components/PostCreation";
import GetSurveys from "./components/getSurveys";
import Activities from "./components/Activities";
import axios from "axios"
import { Activity, Post, Survey } from "./types/user";
export default function Home() {
  type MergedItem = (Post | Survey | Activity) & { type: "post" | "survey" | "activity" };
  const [mergedContent, setMergedContent] = useState<MergedItem[]>([]);
  const [loading, setLoading] = useState(true);
useEffect(()=>{

const fetchAll=async()=>{
  try {
  setLoading(true);
  const token=localStorage.getItem("token");
  const [postRes,surveyRes,activityRes]=await Promise.all([
    axios.get("/api/posts",{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    axios.get("/api/surveys",{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    axios.get("/api/activity",{
      headers: {
        Authorization: `Bearer ${token}`,
      },

    }),


  ]);

  const merged=[
    ...postRes.data.posts.map((item: { [key: string]: any }) => ({ ...item, type: "post" })),
    ...surveyRes.data.surveys.map((item: { [key: string]: any }) => ({ ...item, type: "survey" })),
    ...activityRes.data.activities.map((item: { [key: string]: any }) => ({ ...item, type: "activity" })),
  ]
merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
setMergedContent(merged);
}
catch (err: any) {
  console.error("İçerikler alınamadı:", err);
}
finally {
  setLoading(false);
}


}
fetchAll();
},[])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        <p className="text-gray-500 mt-4">Yükleniyor...</p>
      </div>
    );
  }
  return (
    <div className=" min-h-screen bg-slate-100  py-24 p-4  flex justify-center  ">
      {/* Sol kısım */}
      <div className="hidden md:block w-1/4 px-4 ">
        <LeftBar />
      </div>
      {/* orta kısım (içerik kısmı) */}
      <div className="w-full md:w-1/2 flex flex-col justify-center  max-w-[500px] ">
       <PostCreation />
        {/* buraya bak */}
        {mergedContent.length === 0 ? (
  <div className="text-center text-gray-500 mt-10">Henüz hiç içerik yok.</div>
) : (
  mergedContent.map((item, index) => {
    if (item.type === "post") return <Posts key={`post-${index}`} item={item as Post} />;
    if (item.type === "survey") return <GetSurveys key={`survey-${index}`} item={item as Survey} />;
    if (item.type === "activity") return <Activities key={`activity-${index}`} item={item as Activity} />;
    return null;
  })
)}
      </div>

      {/* Sağ kısım */}
      <div className="hidden md:block w-1/4 px-4">
        <RightBar />
      </div>
    </div>
  );
}
