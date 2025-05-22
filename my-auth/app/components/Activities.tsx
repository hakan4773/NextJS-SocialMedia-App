"use client"
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { format as timeagoFormat } from 'timeago.js';
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { FiMapPin, FiSave, FiUsers } from 'react-icons/fi';
import { Activity } from '../types/user';
import Settings from './Settings';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { toast } from 'react-toastify';
type ActivityProps = {
  item:Activity;
};
function Activities({item}:ActivityProps) {
const {user,setUser} =useAuth();
const [activities, setActivities] = useState<Activity[]>(item ? [item] : []);
const [savedActivities, setSavedActivities] = useState<boolean>(
   Array.isArray(user?.savedActivity) && user?.savedActivity.includes(item._id));
 const [saveCount, setSaveCount] = useState<number>(0);


const fetchSavedActivities = async (postId: string) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return;
  }
  const res = await fetch("/api/activity/saved", {
    method: "POST",
    headers: {   
     Authorization: `Bearer ${token}`,
},
    body: JSON.stringify({ postId}),
})
  if (res.ok) {
    const data = await res.json();
    setSavedActivities(!savedActivities);

    const userCount = data.subscribeUsers?.length || 0;
    setSaveCount(userCount);
setUser((prevUser) => {
  if (!prevUser) return prevUser;
  return {
    ...prevUser,
    savedActivity: data.savedActivity || [],
    subscribeUsers: data.subscribeUsers || [],
  };
});
    toast.success(data.message);
  } else {
    console.error("Failed to fetch saved activities");
  }
}
console.log("subscribe: " ,+ item.subscribeUsers.length)

  return (
<div className="space-y-6">
  {activities && activities.length > 0 ? (
    activities.map((post, index) => (
      <div 
        key={index} 
        className="p-5  bg-white shadow-sm hover:shadow-md  hover:bg-gray-50  cursor-pointer transition-shadow duration-200 border border-gray-100 overflow-hidden"
      >
        {/* Üst Bilgi - Kullanıcı Bilgileri */}
        <div className="flex justify-between items-start mb-3">
        <Link href={`/users/${item.creator._id}`}>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Image
                src={post.creator.profileImage}
                alt="Profile"
                width={44}
                height={44}
                className="rounded-full border-2 border-blue-100 w-11 h-11 object-cover"
              />
            </div>
            <div>
                         <div className="flex items-center space-x-2">
                           <h3 className="font-semibold text-gray-800">{post.creator.name}</h3>
                           {Array.isArray(user?.followers) && user.followers.includes(post.creator._id) ? <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Takip Ediyor</span> : ""}

                         </div>
                         <div className="flex items-center space-x-2 text-xs text-gray-500">
                           <span>{"@"+post.creator.email.split('@')[0]}</span>
                           <span>•</span>
                          <span>{timeagoFormat(post?.createdAt)}</span>
                         </div>
                       </div>
          </div>

  </Link>
        {/* Ayarlar Butonu */}
        <Settings postId={post._id} type={"activities"}  isOwner={post.creator._id.toString() === user?._id?.toString()}/>
        </div>

        {/* Etkinlik Görseli */}
        <div className="relative rounded-lg overflow-hidden mb-3 border border-gray-100">
          <Image
            src={ "/image/yedo.jpg"}
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
              <span>{saveCount} katılımcı</span>
            </div>
            
            <button 
            className={savedActivities ? `bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-medium 
              transition-colors flex items-center` :
              `bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium 
              transition-colors flex items-center` }
            onClick={()=>fetchSavedActivities(post._id)}
            >
              <FiSave className="mr-2" />
             {savedActivities ?  "Kayıtlısınız":"Etkinliğe Kaydol"  } 
            </button>
          </div>
        </div>
      </div>
    ))
  ) : (
  ""
  )}
</div>
  )
}

export default Activities
