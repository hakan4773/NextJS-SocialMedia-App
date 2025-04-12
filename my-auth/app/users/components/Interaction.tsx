"use client";
import React, { useEffect, useState } from "react";
import { FiBookmark, FiHeart, FiMessageCircle, FiShare } from "react-icons/fi";
import { Post, Survey } from "@/app/types/user";
import { toast } from "react-toastify";
import { useAuth } from "@/app/context/AuthContext";
import { FaBookmark } from "react-icons/fa6";
type InteractionProps = {
  item: Post | Survey;
  type: "post" | "survey";
};

function Interaction({ item, type }: InteractionProps) {
  const {user,setUser}=useAuth();
  const [comment, setComment] = useState<Record<number, boolean>>({});
  const [isSaved, setIsSaved] = useState<boolean>(
    Array.isArray(user?.savedPosts) && user?.savedPosts.includes(item._id)
  );
  const getContent=()=>{
   return type==="post" ? (item as Post).content  :(item as Survey).question; 
  };
  const handleComment = (id: number) => {
    setComment((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  useEffect(() => {
    if (user?.savedPosts && item._id) {
      setIsSaved(user.savedPosts.includes(item._id));
    } else {
      setIsSaved(false);
    }
  }, [user, item._id]);
  //Post paylaşım metodu
  const handleShare = (id: string) => {
    const postUrl = `${window.location.origin}/type/${id}`;
    const content=getContent();
    if (navigator.share) {
      navigator
        .share({
          title: "Paylaşım",
          text: content,
          url: postUrl,
        })
        .catch((error) => console.error("Paylaşım hatası", error));
    } else {
      alert("paylaşım desteklenmiyor");
    }
  };

  //Post kaydetme metodu
  const handleSavePost =async(postId:string)=>{
    if (!postId || postId === "undefined") {
      toast.error("Gönderi ID'si bulunamadı!");
      return;
    }
    const token = localStorage.getItem("token");
try {
  const res=await fetch("/api/posts/saved",{
  method:"POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
 
body: JSON.stringify({ postId })
});
const data=await res.json();

if (res.ok) {
  setUser(prev => {
    if (!prev) return prev;
    return {
      ...prev,
      savedPosts: data.savedPosts || []
    };
  });
  setIsSaved(!isSaved);
  toast.success(data.message);
} 


else {
  toast.error(data.message || "Bir hata oluştu");
}

} catch (error) {
  toast.error("post kaydetme başarısız");
  
}
  }
  return (
    <div>
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex justify-between px-4">
          {[
            {
              icon: <FiMessageCircle />,
              count: 0,
              color: "hover:text-blue-500",
            },
            { icon: <FiHeart />, count: 0, color: "hover:text-red-500" },
            { icon: <FiShare />, count: 0, color: "hover:text-green-500" },
            {
              icon: isSaved ? (
                <FaBookmark className="text-yellow-500" />
              ) : (
                <FiBookmark />
              ),
              count: 0,
              color: isSaved ? "text-yellow-500" : "hover:text-yellow-500",
            },

          ].map((Icon, i) => (
            <button
              key={i}
              className={`flex items-center space-x-1 text-gray-500 ${Icon.color} transition-colors`}
              onClick={() => {
                // if (i === 0) handleComment(post?.id);
                 if (i === 2) handleShare(item._id);
                if (i === 3) handleSavePost(item._id);

              }}
            >
              <span className="text-lg">{Icon.icon}</span>
              {Icon.count > 0 && <span className="text-xs">{Icon.count}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Yorum Bölümü */}
      {/* {comment[post.id] && (
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
      )} */}
    </div>
  );
}

export default Interaction;
