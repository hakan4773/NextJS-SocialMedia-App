"use client"
import Image from "next/image";
import { FiCheck } from "react-icons/fi";
import { format } from "timeago.js";
import Interaction from "../users/components/Interaction";
import { Post } from "../types/user";
import Settings from "./Settings";
import { useAuth } from "../context/AuthContext";
type PostsProps = {
  item  : Post;
};
export default function Posts({ item }: PostsProps) {
const {user}=useAuth();
  return (
        <div 
          className="p-5 hover:bg-gray-50  cursor-pointer  bg-white shadow-sm hover:shadow-md transition-shadow duration-400 border border-gray-100"
        >
          {/* Üst Bilgi - Kullanıcı Bilgileri */}
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Image
                  src={item.user.profileImage}
                  alt="Profile"
                  width={44}
                  height={44}
                  className="rounded-full border-2 border-blue-100"
                />
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                  <FiCheck className="text-white text-xs" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-800">{item.user.name}</h3>
                  {Array.isArray(user?.followers) && user.followers.includes(item._id) ? <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Takip Ediyor</span> : ""}
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{"@"+item.user.email.split('@')[0]}</span>
                  <span>•</span>
                  <span>{format(item?.createdAt)}</span>
                </div>
              </div>
            </div>
  
         {/* Ayarlar Butonu */}
         <Settings index={{index:item._id }} isOwner={item.user._id.toString() === user?._id?.toString()}/>
          </div>
  
          {/* Post İçeriği */}
          <div className="mt-3 pl-2">
            <p className="text-gray-800 leading-relaxed">{item.content}</p>
            
            {item.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="text-blue-500 text-xs bg-blue-50 px-2 py-1 rounded-full hover:bg-blue-100 cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {item.image && (
              <div className="mt-3 rounded-lg overflow-hidden border border-gray-100">
                <Image
                  src={item.image}
                  alt="Post"
                  width={600}
                  height={300}
                  className="w-full h-auto object-cover"
                  layout="responsive"
                />
              </div>
            )}
          </div>
  
          {/* Etkileşim Butonları */}
         <Interaction item={item} type="post" />
        </div>
   
  );
}