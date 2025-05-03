"use client"
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { Post } from '../types/user';
import { format } from 'timeago.js';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useRouter } from 'next/navigation';
import Interaction from '../users/components/Interaction';
import Settings from '../components/Settings';
import { useAuth } from '../context/AuthContext';
import Trends from '../components/Trends';

function page() {
  const router=useRouter();
  const {user}=useAuth();
    const [posts, setPosts] = useState<Post[] | null>(null);
    const [searchTerm,setSearchTerm]=useState<string>("");
  const [filter,setFilter]=useState("");
  const [loading,setLoading]=useState(true);
useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setPosts(data.posts);
        setLoading(false);
      } else {
        console.error("Postlar alınamadı:", data.error);
      }
    };
    fetchProfile();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
        setFilter(searchTerm);
    }
    if (filter) {
      setFilter("");
  }
}

  const filteredPosts = filter ? posts?.filter((item) =>
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  ) :posts;


  if (loading) {
    return <div className="p-4 bg-white rounded-lg shadow-md h-full">Yükleniyor...</div>;
  }
  return (
    <div className='min-h-screen flex justify-center py-24  p-4 space-x-6'>
     <div className='hidden md:block w-1/4 px-4'></div>
      <div className='w-full md:w-1/2 flex flex-col justify-center  max-w-[500px] border py-2 bg-white rounded-md border-gray-300  '> 
     
            <div className='relative  p-2 flex '>
         <div className='flex justify-center items-center rounded-full hover:bg-gray-100 p-2 cursor-pointer' >
          <IoIosArrowRoundBack size={25} onClick={()=>router.back()}/>   </div>
             
  <input
    className='border border-gray-300 rounded-full bg-gray-50 w-full mx-4 pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
    placeholder='Ara...'
    value={searchTerm}
    onChange={(e)=>setSearchTerm(e.target.value)}
    onKeyDown={handleKeyDown}
  />  

  <CiSearch className='absolute top-1/2 transform -translate-y-1/2 left-20  text-gray-400' size={20} />

  
</div>

<div className='py-2 flex border-b border-gray-300 text-gray-500'>
   <button className='p-2 w-full hover:bg-gray-200'>Haberler</button>
   <button className='p-2 hover:bg-gray-100 w-full'>Spor</button>
   <button className='p-2 hover:bg-gray-100 w-full'>Eğlence</button>
   <button className='p-2 hover:bg-gray-100 w-full'>Teknoloji</button>

  </div>

  <div className=" space-y-3">
    
      {filteredPosts?.map((post,index) => (
        <div key={post._id} className="p-4   border-b border-gray-300 space-y-4 hover:bg-gray-100 cursor-pointer">  
          
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

   <Interaction item={post} type="post" />
        </div>

      ))}
    </div>

      </div>
{/*Trends */}
<div className="w-1/4 p-4 h-full hidden md:block  ">
       <Trends />
     
</div>

    </div>
  )
}

export default page 
