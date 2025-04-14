"use client";
import React, { useEffect, useState } from "react";
import { Post, Survey, UserType } from "../types/user";
import Image from "next/image";
import Interaction from "../users/components/Interaction";
import Settings from "../components/Settings";
import { format } from "timeago.js";
import { FiCheck, FiFileText } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";

type SavedProps = {
  item: Post | Survey;
  type: "post" | "survey";
};

function Bookmark() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm,setSearchTerm]=useState<string>("");
  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        const res = await fetch("/api/posts/saved", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data=await res.json();
        if (res.ok) {

            setPosts(data.posts);
        }
      } catch (error) {
        console.error("bir hata oluştu");
      }
    };
    fetchData();
  }, []);

const filteredPosts=posts.filter((post)=>post.content.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="min-h-screen flex justify-center py-24  ">
    <div className=' flex flex-col border py-2 bg-white rounded-md border-gray-300 w-full sm:max-w-md md:max-w-lg '> 

   <div className='relative  p-2'>
  <input
onChange={(e) => setSearchTerm(e.target.value)}
  value={searchTerm}
    className='border border-gray-300 rounded-full bg-gray-50 w-full pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
    placeholder='Kaydedilenlerde Ara...'
  />

  <CiSearch className='absolute top-1/2 transform -translate-y-1/2 left-4 text-gray-400' size={20} />

  
</div>

      {filteredPosts && filteredPosts.length > 0 ? (
        filteredPosts.map((post, index) => (
          <div
            key={index}
            className="p-5   bg-white border border-gray-100 shadow-sm rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Image
                  src={post.user.profileImage}
                  alt="Profil"
                  width={44}
                  height={44}
                  className="rounded-full border"
                />
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                  <FiCheck className="text-white text-xs" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{post.user.name}</h3>
                <p className="text-xs text-gray-500">
                  @{post.user.email.split("@")[0]} • {format(post.createdAt)}
                </p>
              </div>
      
      
           
            </div>
 <Settings index={{ index }} />
            </div>

            <div className="mt-3">
              <p className="text-gray-800">{post.content}</p>

              {post.tags?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-blue-500 text-xs bg-blue-50 px-2 py-1 rounded-full"
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

            <Interaction item={post} type="post" />
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-gray-100 text-center">
          <FiFileText className="text-gray-300 text-4xl mb-3" />
          <h3 className="text-gray-500 font-medium">Henüz kaydedilen paylaşım yok</h3>
          <p className="text-gray-400 text-sm mt-1">İlgini çeken paylaşımları kaydetmeyi unutma!</p>
        </div>
      )}
    </div>
    </div>
  );
}

export default Bookmark;
