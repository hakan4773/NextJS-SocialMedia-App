"use client";
import React, { useEffect, useState } from "react";
import { Post, Survey, UserType } from "../types/user";
import Image from "next/image";
import Interaction from "../users/components/Interaction";
import Settings from "../components/Settings";
import { format } from "timeago.js";
import { FiCheck, FiFileText } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";
import { useAuth } from "../context/AuthContext";

type SavedItem = Post | Survey;

function Bookmark() {
  const {user}=useAuth();
  const [posts, setPosts] = useState<SavedItem[]>([]);
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


  const filteredPosts = posts.filter((item) =>
    "content" in item
      ? item.content.toLowerCase().includes(searchTerm.toLowerCase())
      : item.question.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
 return (
    <div className="min-h-screen flex justify-center py-24">
      <div className="flex flex-col border py-2 bg-white rounded-md border-gray-300 w-full sm:max-w-md md:max-w-lg">
        <div className="relative p-2">
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            className="border border-gray-300 rounded-full bg-gray-50 w-full pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Kaydedilenlerde Ara..."
          />
          <CiSearch
            className="absolute top-1/2 transform -translate-y-1/2 left-4 text-gray-400"
            size={20}
          />
        </div>

        {filteredPosts && filteredPosts.length > 0 ? (
          filteredPosts.map((item, index) =>
            "content" in item ? (
              // Render Post
              <div
                key={index}
                className="p-5 bg-white border border-gray-100 shadow-sm rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Image
                        src={(item as Post).user.profileImage}
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
                      <h3 className="font-semibold text-gray-800">
                        {(item as Post).user.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        @{(item as Post).user.email.split("@")[0]} •{" "}
                        {format(item.createdAt)}
                      </p>
                    </div>
                  </div>

                  <Settings index={{ index }} isOwner={(item as Post).user._id.toString() === user?._id?.toString()} />
                </div>

                <div className="mt-3">
                  <p className="text-gray-800">{(item as Post).content}</p>

                  {(item as Post).tags?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(item as Post).tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-blue-500 text-xs bg-blue-50 px-2 py-1 rounded-full"
                        >
                          #{tag}
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

                <Interaction item={item} type="post" />
              </div>
            ) : (
              // Render Survey
              <div
                key={index}
                className="p-4 border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <Image
                      src={(item as Survey).creator.profileImage}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="ml-3">
                      <h3 className="text-lg">
                        {(item as Survey).creator.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {format(item.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Settings index={{ index }} isOwner={(item as Survey).creator._id.toString() === user?._id?.toString()} />
                </div>

                <h2 className="pt-4 ml-2">{(item as Survey).question}</h2>
                <ul className="mt-2 space-y-2">
                
                <ul className="mt-2 space-y-2">
  {(item as Survey).choices.map((choice, idx) => (
    <li
      key={choice._id}
      className="flex justify-between items-center border border-blue-500 rounded-full p-2 cursor-pointer hover:bg-blue-100 transition-all duration-300"
    >
      <span className="text-blue-600 font-bold">
        {choice.text}
      </span>
      <span className="text-gray-500">
        ({choice.voters.length} oy)
      </span>
    </li>
  ))}
</ul>

                   
                    
        
                </ul>
                <p className="text-sm text-gray-500 mt-2">
                  Bitiş: {new Date((item as Survey).endDate).toLocaleString()}
                </p>
                <Interaction item={item} type="survey" />
              </div>
            )
          )
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-gray-100 text-center">
            <FiFileText className="text-gray-300 text-4xl mb-3" />
            <h3 className="text-gray-500 font-medium">
              Henüz kaydedilen paylaşım yok
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              İlgini çeken paylaşımları kaydetmeyi unutma!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


export default Bookmark;
