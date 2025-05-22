"use client"
import Settings from '@/app/components/Settings';
import { useAuth } from '@/app/context/AuthContext';
import { Activity } from '@/app/types/user';
import Image from 'next/image';
import { useEffect, useState } from 'react'
import React from 'react'
import { FiCheck, FiMapPin, FiSave, FiUsers } from 'react-icons/fi';
import { format } from 'timeago.js';

function page() {
    const {user}=useAuth();
    
const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(()=>{
      const fetchActivities = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }
        const res = await fetch("/api/activity/saved", {
          method: "GET",
          headers: {   
           Authorization: `Bearer ${token}`,
      },
        })
        if (res.ok) {
          const data = await res.json();
          setActivities(data.savedActivities);
        } else {
          console.error("Failed to fetch activities");
        }
      }
      fetchActivities();
    },[])
  return (
           <div className="min-h-screen bg-gray-50 py-24 px-4 flex justify-center">
  <div className="w-full max-w-2xl">
    {activities && activities.length > 0 ? (
      <div className="space-y-6">
        {activities.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition-shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">

                <div className="relative">
                  <Image
                    src={item.creator?.profileImage}
                    alt="Profil"
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-blue-100"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 border-2 border-white">
                    <FiCheck className="text-white text-xs" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {item.creator?.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    @{item.creator?.email.split("@")[0]} • {format(item.createdAt)}
                  </p>
                </div>
              </div>
              <Settings
                postId={item._id}
                isOwner={item.creator?._id.toString() === user?._id?.toString()}
                type="post"
              />
            </div>
            
            <div className="mt-4">           
                <div className="mt-4 rounded-lg overflow-hidden border border-gray-100">
                  <Image
                    src={"/image/yedo.jpg"}
                    alt="Post"
                    width={600}
                    height={300}
                    className="w-full h-52 object-cover"
                  />

                </div>

           <div className="space-y-2">
          <h3 className="font-bold text-lg text-gray-900">{item?.activityName}</h3>
          <div className="flex  items-center text-sm text-gray-600">

            <FiMapPin className="mr-2 text-gray-400" />
            <span>Etkinlik Yeri: <b className="text-gray-800">{item.activityType}</b></span>
          </div>
          
          {item.description && (
            <p className="text-gray-600 text-sm line-clamp-2">
              {item.description}
            </p>
          )}
            <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <FiUsers className="mr-1" />
                        <span>{20} katılımcı</span>
                      </div>
                      
              
                    </div>

            </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-400 text-lg">Henüz kaydedilen yok</p>
      </div>
    )}
  </div>
</div>
  )
}

export default page
