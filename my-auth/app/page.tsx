"use client";
import React from "react";
import LeftBar from "./components/LeftBar";
import RightBar from "./components/RightBar";
import Posts from "./components/Posts";
import PostCreation from "./components/PostCreation";
export default function Home() {

  return (
    <div className=" min-h-screen bg-slate-100  py-24 p-4  flex justify-center  ">
      {/* Sol kısım */}
      <div className="hidden md:block w-1/4 px-4 ">
        <LeftBar />
      </div>
      {/* orta kısım (içerik kısmı) */}
      <div className="w-full md:w-1/2 flex flex-col justify-center  max-w-[500px] space-y-4 ">
        <PostCreation />
        <Posts />
      </div>

      {/* Sağ kısım */}
      <div className="hidden md:block w-1/4 px-4">
        <RightBar />
      </div>
    </div>
  );
}
