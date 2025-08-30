"use client";
import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PiDotsThreeBold } from "react-icons/pi";
import { Post } from "../types/user";

export default function Page() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [openSettingIndex, setOpenSettingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hiddenTags, setHiddenTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ["Hepsi", "Haberler", "Spor", "Eğlence", "Teknoloji"];

  const toggleSetting = (index: number) => {
    setOpenSettingIndex(openSettingIndex === index ? null : index);
  };

  const handleHideTag = (tag: string) => {
    setHiddenTags([...hiddenTags, tag.toLowerCase()]);
    setOpenSettingIndex(null);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token bulunamadı");
        const res = await fetch("/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
        } else {
          setError(data.error || "Postlar alınamadı");
        }
      } catch (err: any) {
        setError(err.message || "Bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const allTags: string[] = posts
    ? posts
        .filter((post) => !selectedCategory || selectedCategory === "Hepsi" ) /*|| post?.category === selectedCategory* */
        .map((trend) => trend.tags.map(t => t.trim()))
        .flat()
    : [];

  const tagFrequency: { [key: string]: number } = {};
  allTags.forEach((tag) => {
    const cleanTag = tag.toLowerCase();
    tagFrequency[cleanTag] = (tagFrequency[cleanTag] || 0) + 1;
  });

  const sortedTags = Object.entries(tagFrequency)
    .filter(([tag]) => !hiddenTags.includes(tag))
    .sort((a, b) => b[1] - a[1]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-start bg-gradient-to-b from-indigo-50 to-gray-50 py-24 px-4">
        <div className="w-full max-w-xl">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 border-b border-indigo-200 animate-pulse">
              <div className="h-4 bg-indigo-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-indigo-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-start bg-gradient-to-b from-indigo-50 to-gray-50 py-24 px-4">
      <div className="w-full max-w-xl bg-white border border-indigo-200 rounded-xl shadow-lg">
        <div className="relative p-4 flex items-center ">
          <div
            className="flex justify-center items-center rounded-full hover:bg-indigo-100 p-2 cursor-pointer"
            onClick={() => router.back()}
          >
            <IoIosArrowRoundBack size={25} />
          </div>
          <h2 className="text-lg font-semibold text-center">Trendler</h2>
        </div>

        <div className="flex border-b border-indigo-200 text-gray-600 font-medium">
          {categories.map((category) => (
            <button
              key={category}
              className={`p-3 flex-1 text-center hover:bg-indigo-100 ${
                selectedCategory === category || (category === "Hepsi" && !selectedCategory)
                  ? "bg-indigo-100 text-indigo-700"
                  : ""
              }`}
              onClick={() => setSelectedCategory(category === "Hepsi" ? null : category)}
            >
              {category}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-md mx-4">
            {error}
          </div>
        )}

        <ul className="mt-2 text-xl">
          {sortedTags.length === 0 ? (
            <p className="p-4 text-gray-500 text-center">Eşleşen etiket bulunamadı.</p>
          ) : (
            sortedTags.map(([tag, count], index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg shadow-sm hover:bg-indigo-50 transition-all duration-200 fade-in"
              >
                <div className="relative flex justify-end items-end">
                  <button
                    onClick={() => toggleSetting(index)}
                    className="p-2 rounded-full hover:bg-indigo-100"
                  >
                    <PiDotsThreeBold size={20} />
                  </button>
                  {openSettingIndex === index && (
                    <div className="absolute right-0 top-full mt-2 p-2 w-52 text-sm bg-white rounded-lg shadow-lg z-50">
                      <div className="max-h-96 overflow-y-auto">
                        <p
                          className="p-2 hover:bg-indigo-50 cursor-pointer"
                          onClick={() => handleHideTag(tag)}
                        >
                          Bunu önerme
                        </p>
                        <p className="p-2 hover:bg-indigo-50 cursor-pointer">Spam</p>
                      </div>
                    </div>
                  )}
                </div>
                <li
                  className={`text-sm p-2 flex justify-between ${
                    count > 10 ? "text-indigo-600 font-semibold" : "text-indigo-400"
                  }`}
                >
                  <Link href={`/tweets/${tag.replace("#", "")}`}>
                    {tag} <span className="text-gray-500 ml-1">• {count} paylaşım</span>
                  </Link>
                </li>
              </div>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}