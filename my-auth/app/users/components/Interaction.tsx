"use client";
import React, { useEffect, useState } from "react";
import { FiBookmark, FiHeart, FiMessageCircle, FiShare } from "react-icons/fi";
import { CommentType, Post, Survey } from "@/app/types/user";
import { toast } from "react-toastify";
import { useAuth } from "@/app/context/AuthContext";
import { FaBookmark } from "react-icons/fa6";
type InteractionProps = {
  item: Post | Survey;
  type: "post" | "survey";
};

function Interaction({ item, type }: InteractionProps) {
  const { user, setUser } = useAuth();
  const [comment, setComment] = useState<Record<string, boolean>>({});
  const [commentList, setCommentList] = useState<CommentType[]>([]);
  const [message, setMessage] = useState<string>("");
  const [isSaved, setIsSaved] = useState<boolean>(
    Array.isArray(user?.savedPosts) && user?.savedPosts.includes(item._id)
  );
  const [likes, setLikes] = useState<string[]>(
     "likes" in item && Array.isArray(item.likes)
      ? item.likes
      : []
  );
  const [hasLiked, setHasLiked] = useState<boolean>(
    user ? likes.includes(user._id) : false
  );

  const getContent = () => {
    return type === "post" ? (item as Post).content : (item as Survey).question;
  };
  const handleComment = (id: string) => {
    setComment((prev) => ({ ...prev, [id]: !prev[id] }));
  }; 
  //Yorumları listeleme metodu
async function GetComment() {

  const token = localStorage.getItem("token");
    if (!token) { 
      toast.error("Giriş yapmalısınız!");
      return;
    } 

      try {
    const endpoint =type === "post" ? `/api/posts/comments?postId=${item._id}` : `/api/surveys/comments?postId=${item._id}`;
   const res =await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json();
        if (res.ok) {
          setCommentList(data.comments);
        } else {
          toast.error(data.message);
        }
      
      } catch(error:any) {
        toast.error("Yorumları yükleme başarısız");
      };
  }

  useEffect(() => {
    if (user?.savedPosts && item._id) {
      setIsSaved(user.savedPosts.includes(item._id));
    } else {
      setIsSaved(false);
    }


    if (user?._id && Array.isArray(likes)) {
      setHasLiked(likes.includes(user._id));
    }

   

   GetComment();
}, []);

  //Yorum ekleme metodu
  const handleCommentSubmit = async (postId: string, content: string) => {
    if (!content) {
      toast.error("Yorum boş olamaz!");
      return;
    }
    const token = localStorage.getItem("token");
    try {

      const endpoint = type === "post" ? "/api/posts/comments" : "/api/surveys/comments";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId, content }),
      });
      const data = await res.json();
      if (res.ok) {
         GetComment();
        toast.success(data.message);
        setMessage(""); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Yorum ekleme başarısız");
    }
  };

  //Post paylaşım metodu
  const handleShare = (id: string) => {
    const postUrl = `${window.location.origin}/type/${id}`;
    const content = getContent();
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
  const handleSavePost = async (postId: string) => {
    if (!postId || postId === "undefined") {
      toast.error("Gönderi ID'si bulunamadı!");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/posts/saved", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({ postId }),
      });
      const data = await res.json();

      if (res.ok) {
        setUser((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            savedPosts: data.savedPosts || [],
          };
        });
        setIsSaved(!isSaved);
        toast.success(data.message);
      } else {
        toast.error(data.message || "Bir hata oluştu");
      }
    } catch (error) {
      toast.error("post kaydetme başarısız");
    }
  };

  //Post beğenme metodu
  const handleLike = async (itemId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Giriş yapmalısınız!");
      return;
    }
    try {

      const endpoint= type === "post" ? "/api/posts/likes" : "/api/surveys/likes";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId:itemId }),
      });
      const data = await res.json();
      if (res.ok) {
        setLikes(data.likes);
        setHasLiked(!hasLiked);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Beğeni işlemi başarısız");
    }
  };
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
            { icon:hasLiked ? (
              <FiHeart className="text-red-500" />
            ) : (
              <FiHeart />
            ), 
            count: likes.length,
              color: hasLiked ? "text-red-500" : "hover:text-red-500",
             },

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
                if (i === 0) handleComment(item?._id);
                if (i === 1) handleLike(item._id);
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
        {comment[item._id] && (
  <div className="mt-5 pt-5 border-t border-gray-100">
    {/* Yorum Yazma Alanı */}
    <div className="flex items-start gap-3 mb-6">
      <div className="flex-shrink-0">
        <img 
          src={user?.profileImage || "/default-avatar.jpg"} 
          alt={user?.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
        />
      </div>
      <div className="flex-1 space-y-3">
        <div className="relative">
          <input
            className="w-full border-0 bg-gray-50 rounded-xl px-4 py-3 pr-16 text-sm focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
            placeholder="Bir yorum yazın..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(item._id, message)}
          />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-600 transition-colors"
            onClick={() => handleCommentSubmit(item._id, message)}
            disabled={!message.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        {message && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Hakaret veya rahatsız edici yorumlar yapmayınız</span>
          </div>
        )}
      </div>
    </div>

    {/* Yorum Listesi */}
    <div className="space-y-4">
      {commentList.map((comment) => (
        <div
          key={comment._id}
          className="flex gap-3 group"
        >

          <div className="flex-shrink-0">
            <img 
              src={comment.user?.profileImage|| "/default-avatar.jpg"} 
              alt={comment.user?.name}
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
          </div>
          <div className="flex-1">
            <div className="bg-gray-50 group-hover:bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-none transition-colors">
              <div className="flex items-baseline gap-2 mb-1">
                <p className="font-medium text-sm text-gray-900">
                  {comment.user.name}
                </p>
                <span className="text-xs text-gray-400">
                  {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-gray-700 text-sm">{comment.content}</p>
            </div>
            <div className="flex items-center gap-4 mt-1 px-1">
              <button className="text-xs text-gray-500 hover:text-gray-700">
                Beğen
              </button>
              <button className="text-xs text-gray-500 hover:text-gray-700">
                Yanıtla
              </button>
              <span className="text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          
        </div>
      ))}
    </div>
  </div>
)}
    </div>
  );
}

export default Interaction;
