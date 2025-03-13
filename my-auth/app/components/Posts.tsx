"use client"
import Image from "next/image";
import { useState } from "react";
import { FiBookmark, FiHeart, FiMessageCircle, FiShare } from "react-icons/fi";

export default function Posts() {
  const [comment, setComment] = useState<Record<number, boolean>>({});
  const posts = [
    {
      id: 1,
      user: "Ayşe Yılmaz",
      content: "Bugün harika bir gün! ☀️",
      image: "/orman.jpg",
      tags: ["#Tatil", "#Güneş"],
      createdAt: "2 saat önce",
    },
    {
      id: 2,
      user: "Ali Kaya",
      content: "Yeni bir proje üzerinde çalışıyorum! 🚀",
      tags: ["#Yazılım", "#Proje"],
      createdAt: "1 gün önce",
    },
  ];
  const handleComment=(id:number)=>{
    setComment((prev)=>(
{...prev,[id]:!prev[id]}
    ))
  }

  
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
    <div className=" rounded-md shadow-md space-y-3">
      {posts.map((post,index) => (
        <div key={post.id} className="p-4 rounded-lg bg-white  shadow-md space-y-4">
          <div className="flex items-center">
            <Image
              src="/3.jpg"
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="ml-3">
              <h3 className=" font-semibold">{post.user}</h3>
              <p className="text-gray-300 text-sm">{post.createdAt}</p>
            </div>
          </div>
          <p className="mt-2 ">{post.content}</p>
          {post.image && (
            <Image
              src={post.image}
              alt="Post"
              width={400}
              height={200}
              className="mt-2 rounded-lg w-full object-cover"
            />
          )}
          <div className=" flex space-x-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-blue-400 text-sm">
                {tag}
              </span>
            ))}
          </div>
 
{/* Etkileşim Çubuğu */}
<div className="mt-4 flex justify-between items-center ">
        <button onClick={() => handleComment(post.id)} className="flex items-center space-x-1 hover:text-blue-400">
          <FiMessageCircle size={20} />
          <span>Yorum</span>

        
        </button>
      
        <button  className="flex items-center space-x-1 hover:text-red-400">
          <FiHeart  size={20} />
          <span>{0}</span>
        </button>
        <button onClick={() => handleShare(post.id, post.content)} className="flex items-center space-x-1 hover:text-green-400 cursor-pointer">
          <FiShare  size={20} />
          <span>Paylaş</span>
        </button>
        <button  className="flex items-center space-x-1 hover:text-yellow-400">
          <FiBookmark size={20}  />
          <span>Kaydet</span>
        </button>
      </div>
      {comment[post.id] && (
           <div className="flex mt-2 space-x-2"> 
             <input
              className="border rounded-xl bg-gray-200 w-full  p-2"
              placeholder="Yorum yaz..."
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 cursor-pointer">Gönder</button>
           </div>

          )}
        </div>

      ))}
    </div>
  );
}