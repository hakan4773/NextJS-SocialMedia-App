"use client"
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Post } from '@/app/types/user';
import Settings from '@/app/components/Settings';
import Image from 'next/image';
import Interaction from '@/app/users/components/Interaction';
import { format } from 'timeago.js';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

function page() {
    const { slug } = useParams();
    console.log(slug)
    const { user } = useAuth();
    const [posts, setPosts] = React.useState([]);

    useEffect(() => {
        if (!slug) return;
    
        const fetchPostsByTag = async () => {
          try {
            const res = await fetch("/api/posts", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            const data = await res.json();
            if (res.ok) {
              const postsWithTag = data.posts.filter((post: Post) =>
                post.tags.includes(`#${slug}`)
              );
              setPosts(postsWithTag);
            } else {
              console.error("Postlar alınamadı:", data.error);
            }
          } catch (err) {
            console.error("Hata oluştu:", err);
          }

        } 
    fetchPostsByTag();
    },[])

console.log(posts)
  return (
<div className="flex justify-center py-24">
  <div className="w-full max-w-2xl">

      {posts.length > 0 ? (
        posts.map((post: Post, index: number) => (
            <div key={post._id} className="p-4   border rounded-md border-gray-300 space-y-4 hover:bg-gray-100 cursor-pointer">  
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
      <Link href={`/tweets/${tag.replace("#","")}`} key={tag} className="text-blue-400 text-sm">
        {tag}
      </Link>
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
        ))
        ) : (
        <div className="p-4 bg-white rounded-lg shadow-md h-full">Bu tag ile ilgili bir paylaşım yok.</div>
          )}
      </div>
      </div>
    );
}

export default page
