"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FiBookmark, FiCheck, FiFileText, FiHeart, FiMessageCircle, FiShare } from "react-icons/fi";
import { IoStatsChartOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { PiDotsThreeBold } from "react-icons/pi";
import { TiPinOutline } from "react-icons/ti";
import { format } from "timeago.js";
interface PostTypes{
  id: number;

  content: string;
  tags: string[];
  image: string;
  createdAt: Date;
  user: { name: string; profileImage: string ,email:string;}; 
}
export default function Posts() {
  const [comment, setComment] = useState<Record<number, boolean>>({});
  const [posts,setPosts]=useState<PostTypes[] | null>(null)
  
  const [openSettingIndex, setOpenSettingIndex] = useState<number | null>(null);
  const toggleSetting = (index: any) => {
    setOpenSettingIndex(openSettingIndex === index ? null : index);
  };
useEffect(()=>{
 const token= localStorage.getItem("token")
const fetchPosts=async()=>{
const res=await fetch("/api/posts",{
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
const data = await res.json();
console.log(data);
setPosts(data.posts);
}
fetchPosts();
},[])


  const handleComment=(id:number)=>{
    setComment((prev)=>(
{...prev,[id]:!prev[id]}
    ))
  }

  //Post paylaşım metodu
  const handleShare=(id:number,content:string)=>{
    const postUrl=`${window.location.origin}/post/${id}`
    
    if(navigator.share){
    navigator.share({
    title:"Paylaşım",
    text:content,
    url:postUrl
    }).catch((error)=>console.error("Paylaşım hatası",error))
    
    }
    else {
      alert("paylaşım desteklenmiyor")
    }
  }
  return (
    <div className="">
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
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex justify-between px-4">
              {[
                { icon: <FiMessageCircle />, count: 0, color: "hover:text-blue-500" },
                { icon: <FiHeart />, count: 0, color: "hover:text-red-500" },
                { icon: <FiShare />, count: 0, color: "hover:text-green-500" },
                { icon: <FiBookmark />, count: 0, color: "hover:text-yellow-500" }
              ].map((item, i) => (
                <button
                  key={i}
                  className={`flex items-center space-x-1 text-gray-500 ${item.color} transition-colors`}
                  onClick={() => {
                    if (i === 0) handleComment(post.id);
                    if (i === 2) handleShare(post.id, post.content);
                  }}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.count > 0 && <span className="text-xs">{item.count}</span>}
                </button>
              ))}
            </div>
          </div>
  
          {/* Yorum Bölümü */}
          {comment[post.id] && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex space-x-2">
                <input
                  className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Yorum yaz..."
                />
                <button 
                  type="submit" 
                  className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  Gönder
                </button>
              </div>
            </div>
          )}
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