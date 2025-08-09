"use client";
import { FaArrowTrendUp } from "react-icons/fa6";
import Link from "next/link";
import { PiDotsThreeBold } from "react-icons/pi";
import { useEffect, useState } from "react";

type TagType = {
  tag: string;
  count: number;
};

function Trends() {
  const [openSettingIndex, setOpenSettingIndex] = useState<number | null>(null);
  const [tags, setTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState(true);

  const toggleSetting = (index: number) => {
    setOpenSettingIndex(openSettingIndex === index ? null : index);
  };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch("/api/posts/tags");
        const data = await res.json();

        if (res.ok && Array.isArray(data.tags)) {
          setTags(data.tags);
        } else {
          console.error("Tag verisi alınamadı:", data?.error || "Geçersiz yanıt yapısı");
        }
      } catch (error) {
        console.error("İstek sırasında hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold flex">
          <FaArrowTrendUp className="mr-2" /> Trendler
        </h3>
        <p className="text-sm text-gray-500 mt-2">Yükleniyor...</p>
      </div>
    );
  }

  return (
      <div className="p-4 bg-white rounded-lg shadow-md h-full"> 

        <h3 className="text-lg font-semibold flex"><FaArrowTrendUp  className="mr-2" />Trendler</h3>
        <ul className="mt-2  text-xl">
          {tags.slice(0,5).map((item, index) => (
          <div key={index} className="hover:bg-gray-50">
            <div className="relative flex justify-end items-end">
              <button onClick={() => toggleSetting(index)} className="cursor-pointer">
                <PiDotsThreeBold />
              </button>

              {openSettingIndex === index && (
                <div className="absolute right-0 top-full mt-2 p-2 w-52 text-sm bg-white rounded-lg shadow-lg z-50">
                  <div className="max-h-96 overflow-y-auto">
                    <p className="relative p-2 hover:bg-gray-50 cursor-pointer">Bunu önerme</p>
                    <p className="relative p-2 hover:bg-gray-50 cursor-pointer">Spam</p>
                  </div>
                </div>
              )}
            </div>

            <li className="text-blue-400 text-sm p-2 flex justify-between">
              <Link href={`/tweets/${item.tag.replace("#", "")}`}>
                {item.tag} <span className="text-gray-400 ml-1">• {item.count} paylaşım</span>
              </Link>
            </li>
          </div>
        ))}

        <div className="flex justify-center text-sm p-2 hover:bg-slate-200">
          <Link href={"/tweets"} className="cursor-pointer">
            Daha Fazla Göster
          </Link>
        </div>
      </ul>
    </div>
  );
}
export default Trends
