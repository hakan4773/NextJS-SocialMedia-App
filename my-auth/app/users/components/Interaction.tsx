"use client";
import React, { useState } from "react";
import { FiBookmark, FiHeart, FiMessageCircle, FiShare } from "react-icons/fi";
interface Post {
  id: number;
  content: string;
  tags: string[];
  image?: string;
  createdAt: string;
  comments: string[];
  likes: number;
  user: { name: string; profileImage: string; email: string };
}
function Interaction({ post }: { post: Post }) {
  const [comment, setComment] = useState<Record<number, boolean>>({});

  const handleComment = (id: number) => {
    setComment((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  //Post paylaşım metodu
  const handleShare = (id: number, content: string) => {
    const postUrl = `${window.location.origin}/post/${id}`;

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
          ].map((item, i) => (
            <button
              key={i}
              className={`flex items-center space-x-1 text-gray-500 ${item.color} transition-colors`}
              onClick={() => {
                if (i === 0) handleComment(post?.id);
                if (i === 2) handleShare(post?.id, post?.content);
              }}
            >
              <span className="text-lg">{item.icon}</span>
              {item.count > 0 && <span className="text-xs">{item.count}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Yorum Bölümü */}
      {comment[post.id] && (
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
      )}
    </div>
  );
}

export default Interaction;
