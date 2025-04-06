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
import { FiCalendar, FiEye, FiMapPin, FiUsers } from 'react-icons/fi';
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
  {activities && activities.length > 0 ? (
    activities.map((post, index) => (
      <div 
        key={index} 
        className="p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 overflow-hidden"
      >
        {/* Üst Bilgi - Kullanıcı Bilgileri */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Image
                src={post.creator.profileImage}
                alt="Profile"
                width={44}
                height={44}
                className="rounded-full border-2 border-blue-100"
              />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">{post.creator.name}</h3>
              <p className="text-xs text-gray-500">
                {format(new Date(post.createdAt), "dd.MM.yyyy HH:mm")}
              </p>
            </div>
          </div>

          {/* Ayarlar Butonu */}
          <div className="relative">
            <button
              onClick={() => toggleSetting(index)}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <PiDotsThreeBold size={20} />
            </button>
            
            {openSettingIndex === index && (
              <div className="absolute right-0 top-8 mt-1 w-48 bg-white rounded-md shadow-xl z-50 border border-gray-100">
                {[
                  { icon: <MdDeleteOutline className="text-red-500" />, text: "Sil" },
                  { icon: <CiEdit />, text: "Düzenle" },
                  { icon: <TiPinOutline />, text: "Profile Sabitle" },
                  { icon: <IoStatsChartOutline />, text: "İstatistikler" }
                ].map((item, i) => (
                  <button
                    key={i}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Etkinlik Görseli */}
        <div className="relative rounded-lg overflow-hidden mb-3 border border-gray-100">
          <Image
            src={post.profileImage || "/image/yedo.jpg"}
            alt="Etkinlik Görseli"
            width={600}
            height={300}
            className="w-full h-48 object-cover"
            layout="responsive"
          />
          {/* Etkinlik tarih badge */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
            <p className="font-bold text-sm text-gray-800">
              {format(new Date(post.startDate), "eee, d MMM yyyy", { locale: tr })} • 
              <span className="text-blue-600 ml-1">
                {post.activityDate.hours}:{post.activityDate.minutes.toString().padStart(2, '0')}
              </span>
            </p>
          </div>
        </div>

        {/* Etkinlik Detayları */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-gray-900">{post?.activityName}</h3>
          
          <div className="flex items-center text-sm text-gray-600">
            <FiMapPin className="mr-2 text-gray-400" />
            <span>Etkinlik Yeri: <b className="text-gray-800">{post.activityType}</b></span>
          </div>
          
          {post.description && (
            <p className="text-gray-600 text-sm line-clamp-2">
              {post.description}
            </p>
          )}
          
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center text-sm text-gray-500">
              <FiUsers className="mr-1" />
              <span>{20} katılımcı</span>
            </div>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center">
              <FiEye className="mr-2" />
              Etkinliği Görüntüle
            </button>
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-gray-100 text-center">
      <FiCalendar className="text-gray-300 text-4xl mb-3" />
      <h3 className="text-gray-500 font-medium">Henüz etkinlik yok</h3>
      <p className="text-gray-400 text-sm mt-1">İlk etkinliği sen oluşturmak ister misin?</p>
    </div>
  )}
</div>
  )
}

export default Activities
