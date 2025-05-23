"use client"
import React, { useEffect, useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { Post } from '../types/user';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { PiDotsThreeBold } from 'react-icons/pi';

function page() {
  const router=useRouter();
  const {user}=useAuth();
    const [posts, setPosts] = useState<Post[] | null>(null);
    const [searchTerm,setSearchTerm]=useState<string>("");
  const [filter,setFilter]=useState("");
  const [openSettingIndex, setOpenSettingIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
 const toggleSetting=(index:any)=>{
    setOpenSettingIndex(openSettingIndex === index ? null: index)
 }


useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
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

  // const filteredPosts = filter ? posts?.filter((item) =>
  //     item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  // ) :posts;

  const allTags: string[] = posts ? posts.map((trend) => trend.tags).flat() : [];
    const tagFrequency: { [key: string]: number } = {};
    allTags.forEach((tag) => {
      const cleanTag = tag.trim().toLowerCase();
      tagFrequency[cleanTag] = (tagFrequency[cleanTag] || 0) + 1;
    });
    const sortedTags = Object.entries(tagFrequency).sort((a, b) => b[1] - a[1]);


   if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        <p className="text-gray-500 mt-4">Yükleniyor...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-50 py-24 px-4">
      {/* Orta Kutu */}
      <div className="w-full max-w-xl bg-white border border-gray-300 rounded-md shadow-sm">
        {/* Geri Dön ve Arama */}
        <div className="relative p-4 flex items-center">
          <div
            className="flex justify-center items-center rounded-full hover:bg-gray-100 p-2 cursor-pointer"
            onClick={() => router.back()}
          >
            <IoIosArrowRoundBack size={25} />
          </div>
  
          <input
            className="border border-gray-300 rounded-full bg-gray-50 w-full mx-4 pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
  
          <CiSearch
            className="absolute left-20 transform -translate-y-1/2 top-1/2 text-gray-400"
            size={20}
          />
        </div>
  
        {/* Kategoriler */}
        <div className="py-2 flex border-b border-gray-300 text-gray-500 text-sm font-medium">
          <button className="p-2 w-full hover:bg-gray-100">Haberler</button>
          <button className="p-2 w-full hover:bg-gray-100">Spor</button>
          <button className="p-2 w-full hover:bg-gray-100">Eğlence</button>
          <button className="p-2 w-full hover:bg-gray-100">Teknoloji</button>
        </div>
  
        {/* Trendler */}
        
         <ul className="mt-2  text-xl">
                  {sortedTags.map(([tag,count],index) => (
                    
                    <div key={index} className="hover:bg-gray-50 p-2" >
                    <div className="relative  flex justify-end items-end ">
                        <button onClick={() => toggleSetting(index)} className="cursor-pointer" ><PiDotsThreeBold /></button>
        
                        {openSettingIndex === index && ( <div className="absolute right-0 top-full mt-2 p-2 w-52 text-sm bg-white rounded-lg shadow-lg z-50"> 
                            <div className="max-h-96 overflow-y-auto"> 
                            <p  className="relative p-2 hover:bg-gray-50 cursor-pointer">Bunu önerme</p> 
                            <p  className="relative p-2 hover:bg-gray-50 cursor-pointer">Spam</p> 
        
                            </div> </div> )}
                    </div>
        
                    <li className="text-blue-400 text-sm  p-2 flex justify-between ">
                    <Link href={`/tweets/${tag.replace("#", "")}`}>
          {tag} <span  className="text-gray-400 ml-1">• {count} paylaşım</span>
        </Link>
        
                    </li>
                    
                    </div>
                  ))}
        {/* Yükleme */}
                  <div className="flex justify-center text-sm p-2  hover:bg-slate-200 ">
                    <Link href={"/tweets"} className="cursor-pointer">Daha Fazla Göster</Link></div>
                </ul>
      </div>
    </div>
  );
  
}

export default page 
