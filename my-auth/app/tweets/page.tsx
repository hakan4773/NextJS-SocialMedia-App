"use client"
import Image from 'next/image';
import React, { useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { FiBookmark, FiHeart, FiMessageCircle, FiShare } from 'react-icons/fi';
import { PiDotsThreeBold } from 'react-icons/pi';

function page() {
    const [comment, setComment] = useState<Record<number, boolean>>({});
    const [openSettingIndex, setOpenSettingIndex] = useState<number | null>(null);
    const [tags,setTags]=useState<string>("");
    const [searchTerm,setSearchTerm]=useState<string>("");
  const [filter,setFilter]=useState("");
    const toggleSetting=(index:any)=>{
       setOpenSettingIndex(openSettingIndex === index ? null: index)
    }
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
        setFilter(searchTerm);
    }
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



  const filteredPosts =filter ? posts.filter((item) =>
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  ) :posts;
  return (
    <div className='min-h-screen flex justify-center py-24  '>
      <div className=' flex flex-col border py-2 bg-white rounded-md border-gray-300 w-full sm:max-w-md md:max-w-lg '> 
      <div className='relative  p-2'>
  <input
    className='border border-gray-300 rounded-full bg-gray-50 w-full pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
    placeholder='Ara...'
    value={searchTerm}
    onChange={(e)=>setSearchTerm(e.target.value)}
    onKeyDown={handleKeyDown}
  />  

  <CiSearch className='absolute top-1/2 transform -translate-y-1/2 left-4 text-gray-400' size={20} />

  
</div>

<div className='py-2 flex border-b border-gray-300 text-gray-500'>
   <button className='p-2 w-full hover:bg-gray-200'>Haberler</button>
   <button className='p-2 hover:bg-gray-100 w-full'>Spor</button>
   <button className='p-2 hover:bg-gray-100 w-full'>Eğlence</button>
   <button className='p-2 hover:bg-gray-100 w-full'>Teknoloji</button>

  </div>

  <div className=" space-y-3">
    
      {filteredPosts.map((post,index) => (
        <div key={post.id} className="p-4   border-b border-gray-300 space-y-4 hover:bg-gray-100 cursor-pointer">  
          
          <div className="flex items-center ">
            <Image
              src="/3.jpg"
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="ml-3 w-full">
              <h3 className=" font-semibold">{post.user}</h3>
              <p className="text-gray-300 text-sm">{post.createdAt}</p>
            </div> 
             <div className="relative  flex justify-end items-end ">
                <button onClick={() => toggleSetting(index)} className="cursor-pointer" ><PiDotsThreeBold  size={25}/></button>

                {openSettingIndex === index && ( <div className="absolute right-0 top-full mt-2 p-2 w-52 text-sm bg-white rounded-lg shadow-lg z-50"> 
                    <div className="max-h-96 overflow-y-auto"> 
                    <p  className="relative p-2 hover:bg-gray-50 cursor-pointer">Bunu önerme</p> 
                    <p  className="relative p-2 hover:bg-gray-50 cursor-pointer">Spam</p> 

                    </div> </div> )}
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

      </div>
    </div>
  )
}

export default page 
