"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FiBookmark, FiHeart, FiMessageCircle, FiShare } from "react-icons/fi";
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
  user: { name: string; profileImage: string }; 
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
    <div className="  space-y-3">
     {posts &&  posts.length > 0 ? (posts?.map((post,index) => (
        <div key={index} className="p-4 rounded-lg bg-white  shadow-md space-y-2">
        
                {/* Kullanıcı bilgisi */}
          <div className="flex items-center">
            <Image
              src={post.user.profileImage}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="ml-3">
              <h3 className="  text-lg">{post.user.name}</h3>
              <p className="text-gray-400 text-sm">{format(post?.createdAt)}</p>
            </div>
          </div>
     {/* seçenekler */}
             <div className="relative  flex justify-end ">
                              <button
                                onClick={() => toggleSetting(index)}
                                className="absolute bottom-8 cursor-pointer"
                              >
                                <PiDotsThreeBold size={25} />
                              </button>
          
                              {openSettingIndex === index && (
                                <div className="absolute right-0 -top-12 mt-2 p-2 w-64 font-semibold bg-white rounded-lg shadow-lg z-50">
                                  <div className="max-h-96 overflow-y-auto">
                                    <p className="relative p-2 hover:bg-gray-50 cursor-pointer flex space-x-4">
                                      <MdDeleteOutline
                                        className="text-red-500"
                                        size={25}
                                      />
                                      <span>Sil</span>
                                    </p>
                                    <p className="relative p-2 hover:bg-gray-50 cursor-pointer flex space-x-4">
                                      <CiEdit size={25} />
                                      <span>Düzenle</span>
                                    </p>
                                    <p className="relative p-2 hover:bg-gray-50 cursor-pointer flex space-x-4">
                                      <TiPinOutline size={25} />
                                      <span>Profile Sabitle</span>{" "}
                                    </p>
                                    <p className="relative p-2 hover:bg-gray-50 cursor-pointer flex space-x-4">
                                      <IoStatsChartOutline size={25} />
                                      <span>Post istatistiklerini görüntüle</span>
                                    </p>
                                  </div>{" "}
                                </div>
                              )}
                            </div>   


          {/* post bilgisi */}
          <p className="mt-2 ">{post.content}</p>
                <div className=" flex space-x-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-blue-400 text-sm">
              {tag}
              </span>
            ))} 
          </div>
          
          {post.image && (
            <Image
              src={post.image}
              alt="Post"
              width={400}
              height={200}
              className="mt-2 rounded-lg w-full object-cover"
            />
          )}
        
  
{/* Etkileşim Çubuğu */}
<div className="mt-4 flex justify-between items-center ">
        
        <button 
         onClick={() => handleComment(post.id)}
         className="flex items-center space-x-1 hover:text-blue-400">
          <FiMessageCircle size={20} />
          <span>Yorum</span>

        
        </button>
      
        <button  className="flex items-center space-x-1 hover:text-red-400">
          <FiHeart  size={20} />
          <span>{0}</span>
        </button>
        <button 
         onClick={() => handleShare(post.id, post.content)}
        className="flex items-center space-x-1 hover:text-green-400 cursor-pointer">
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
              className="border rounded-xl border-gray-300 w-full  p-2"
              placeholder="Yorum yaz..."
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 cursor-pointer">Gönder</button>
           </div>

          )}
        </div>))
) : (
  <div className="text-gray-500 text-center p-4 min-h-[250px]">Henüz paylaşım yapılmadı.</div>
)}
  
    </div>
  );
}