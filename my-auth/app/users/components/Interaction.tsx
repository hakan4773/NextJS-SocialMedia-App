"use client";
import React, { useState } from "react";
import { FiBookmark, FiHeart, FiMessageCircle, FiShare } from "react-icons/fi";
import { Post, Survey } from "@/app/types/user";
import { toast } from "react-toastify";
type InteractionProps = {
  item: Post | Survey;
  type: "post" | "survey";
};

function Interaction({ item, type }: InteractionProps) {
  const [comment, setComment] = useState<Record<number, boolean>>({});

  const handleComment = (id: number) => {
    setComment((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  //Post paylaşım metodu
  const handleShare = (id: string) => {
    const postUrl = `${window.location.origin}/post/${id}`;

    if (navigator.share) {
      navigator
        .share({
          title: "Paylaşım",
 
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
console.log(data)
if(res.ok)
{
  toast.success("post kaydetme başarılı");
  
}


else {
  toast.error(data.message || "Bir hata oluştu");
}

} catch (error) {
  toast.success("post kaydetme başarısız");
  
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
            { icon: <FiBookmark />, count: 0, color: "hover:text-yellow-500" },
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
