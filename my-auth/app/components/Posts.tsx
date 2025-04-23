"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import { FiCheck, FiFileText } from "react-icons/fi";
import { format } from "timeago.js";
import Interaction from "../users/components/Interaction";
import { Post } from "../types/user";
import Settings from "./Settings";
import { useAuth } from "../context/AuthContext";
type PostsProps = {
  userId?: string;
  isMyProfile:boolean;
};
export default function Posts({ userId, isMyProfile }: PostsProps) {
const {user}=useAuth();
  const [posts,setPosts]=useState<Post[] | null>(null)
  
useEffect(()=>{
 const token= localStorage.getItem("token")
const fetchPosts=async()=>{
  const url = userId ? `/api/users/${userId}` : "/api/posts";
const res=await fetch(url,{
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
const data = await res.json();
isMyProfile ? setPosts(data.Myposts): setPosts(data.posts);
}
fetchPosts();
},[])

 
  return (
    <div>
    {posts && posts.length > 0 ? (
      posts?.map((post, index) => (
        <div 
          key={index} 
          className="p-5 hover:bg-gray-50  cursor-pointer  bg-white shadow-sm hover:shadow-md transition-shadow duration-400 border border-gray-100"
        >
          {/* Üst Bilgi - Kullanıcı Bilgileri */}
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Image
                  src={post.user.profileImage}
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
                  <h3 className="font-semibold text-gray-800">{post.user.name}</h3>
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Takip Ediyor</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{"@"+post.user.email.split('@')[0]}</span>
                  <span>•</span>
                  <span>{format(post?.createdAt)}</span>
                </div>
              </div>
            </div>
  
         {/* Ayarlar Butonu */}
         <Settings index={{ index }} isOwner={post.user._id.toString() === user?._id?.toString()}/>
          </div>
  
          {/* Post İçeriği */}
          <div className="mt-3 pl-2">
            <p className="text-gray-800 leading-relaxed">{post.content}</p>
            
            {post.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="text-blue-500 text-xs bg-blue-50 px-2 py-1 rounded-full hover:bg-blue-100 cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            
            {post.image && (
              <div className="mt-3 rounded-lg overflow-hidden border border-gray-100">
                <Image
                  src={post.image}
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
         <Interaction item={post} type="post" />
        </div>
      ))
    ) : (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-gray-100 text-center">
        <FiFileText className="text-gray-300 text-4xl mb-3" />
        <h3 className="text-gray-500 font-medium">Henüz paylaşım yapılmadı</h3>
        <p className="text-gray-400 text-sm mt-1">İlk paylaşımı sen yapmak ister misin?</p>
      </div>
    )}
  </div>
  );
}