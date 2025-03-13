"use client";

import React, { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";
import LeftBar from "./components/LeftBar";
import RightBar from "./components/RightBar";
import Posts from "./components/Posts";
import PostCreation from "./components/PostCreation";
export default function Home() {

const router = useRouter();  
const { user } = useAuth();

  useEffect(() => {
    
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [user]);

 


  return (
    <div className=" min-h-screen bg-slate-100  py-24 p-4  flex justify-center" >
{/* Sol kısım */}

      <div className="hidden md:block w-1/4 px-4 ">
         <LeftBar />
      </div>
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
