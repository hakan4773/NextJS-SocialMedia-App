"use client"
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { CiEdit } from 'react-icons/ci';
import { IoStatsChartOutline } from 'react-icons/io5';
import { MdDeleteOutline } from 'react-icons/md';
import { PiDotsThreeBold } from 'react-icons/pi';
import { TiPinOutline } from 'react-icons/ti';
// import { format } from 'timeago.js';
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
function Activities() {
interface Activity {
  activityName: string;
  activityDate: {   hours: number; minutes: number };
    activityType:string;
  creator: {
    profileImage: string;
    name: string;
  };
  description: string;
  profileImage?: string;
  startDate:Date;
  createdAt:Date;
}

const [activities, setActivities] = useState<Activity[]>([]);
  const [openSettingIndex, setOpenSettingIndex] = useState<number | null>(null);

  const toggleSetting = (index: any) => {
    setOpenSettingIndex(openSettingIndex === index ? null : index);
  };
useEffect(()=>{
 const token= localStorage.getItem("token")
const fetchPosts=async()=>{
const res=await fetch("/api/activity",{
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
const data = await res.json();
setActivities(data.activities);
}
fetchPosts();
},[])



console.log(activities)

  return (
    <div className="space-y-6">
    {activities && activities.length > 0 && activities.map((post, index) => (
      <div key={index} className="p-4 rounded-lg bg-white shadow-md space-y-4 relative">
      {/* Kullanıcı bilgisi */}
     <div className="flex items-center ">
          <Image
            src={post.creator.profileImage}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="ml-3">
            <h3 className="text-lg ">{post.creator.name}</h3>
            {/* <p className="text-gray-400 text-sm">{format(new Date(post.createdAt), "dd.MM.yyyy HH:mm")}</p> */}
          </div>
        </div>
        
          {/* Ayar menüsü */}
        <div className="relative flex justify-end items-end ">
          <button
            onClick={() => toggleSetting(index)}
            className="absolute bottom-8 right-0 cursor-pointer"
          >
            <PiDotsThreeBold size={25} />
          </button>

          {openSettingIndex === index && (
            <div className="absolute right-0 -top-12 mt-2 p-2 w-64 font-semibold bg-white rounded-lg shadow-lg z-50">
              <div className="max-h-96 overflow-y-auto">
                <p className="relative p-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-4">
                  <MdDeleteOutline className="text-red-500" size={25} />
                  <span>Sil</span>
                </p>
                <p className="relative p-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-4">
                  <CiEdit size={25} />
                  <span>Düzenle</span>
                </p>
                <p className="relative p-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-4">
                  <TiPinOutline size={25} />
                  <span>Profile Sabitle</span>
                </p>
                <p className="relative p-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-4">
                  <IoStatsChartOutline size={25} />
                  <span>Post istatistiklerini görüntüle</span>
                </p>
              </div>
            </div>
          )}
        </div>

 
  {/* Etkinlik görseli */}
     
          <Image
            src={"/image/yedo.jpg"}
            alt="Post"
            width={400}
            height={100}
            className="mt-2 rounded-lg w-full h-[200px] object-fit"
          />
     {/* {post.profileImage && (       )}  */}
        <p className='font-bold text-sm'>{format(new Date(post.startDate), "eee, d MMM yyyy", { locale: tr })} , {post.activityDate.hours + ":" + post.activityDate.minutes} </p>
         {/* Etkinlik içeriği */}

        <p className=" font-bold ">{post?.activityName}</p>
        <p className="">Etkinlik Yeri : <b>{post.activityType}</b></p>
        {/* <p className="">{post.description.substring(0,100)+"..."}</p> */}
           <p className='text-gray-400 text-sm'>20 katılımcı </p>
       <button className='border rounded-full p-2 w-full bg-blue-600 text-white hover:bg-blue-400'> Görüntüle</button>

      </div>
    ))}
  </div>
  )
}

export default Activities
