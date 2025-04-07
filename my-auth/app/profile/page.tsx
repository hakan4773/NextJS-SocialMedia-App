"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  FiBookmark,
  FiEdit2,
  FiHeart,
  FiMessageCircle,
  FiSettings,
  FiShare,
} from "react-icons/fi";
import { PiDotsThreeBold } from "react-icons/pi";
import { MdDeleteOutline } from "react-icons/md";
import { TiPinOutline } from "react-icons/ti";
import { CiEdit } from "react-icons/ci";
import { IoStatsChartOutline } from "react-icons/io5";
import { format } from "timeago.js";
import Link from "next/link";
import Posts from "../components/Posts";

interface UserType {
  id: string;
  name: string;
  email: string;
  password: string;
  bio: string;
  profileImage: string;
}


export default function ProfilePage() {
  const [userData, setUserData] = useState<UserType | null>();


  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUserData(data.user);
      
      } else {
        console.error("Profil verisi alınamadı:", data.error);
      }

    };
    fetchProfile();
  }, []);



  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-700 via-purple-600 to-pink-400  py-24">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profil bilgisi */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Image
                src={userData?.profileImage || "/profil.jpg"}
                alt="Profil Fotoğrafı"
                width={120}
                height={120}
                className="rounded-full lg:w-32 lg:h-32 w-24 h-24 border-2 border-gray-300"
              />
              <button className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600">
                <FiEdit2 size={16} />
              </button>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">
                  {userData?.name}
                </h1>
                <div className="flex lg:space-x-2 lg:space-y-0 space-y-4 lg:flex-row flex-col">
                <Link href={"/profile/edit"} className="flex items-center space-x-2 text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-300">
                  <CiEdit size={18} />
                  <span> Güncelle</span>
                </Link>
                <button className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200">
                  <FiSettings size={18} />
                  <span>Ayarlar</span>
                </button> </div>
              </div>
              <p className="text-gray-600 mt-1">{userData?.email}</p>
              <p className="text-gray-700 mt-3">{userData?.bio}</p>
            </div>
          </div>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Paylaşımlar</h3>
            <p className="text-2xl font-bold text-blue-500 mt-2">245</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Takipçiler</h3>
            <p className="text-2xl font-bold text-blue-500 mt-2">1.2K</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">
              Takip Edilenler
            </h3>
            <p className="text-2xl font-bold text-blue-500 mt-2">348</p>
          </div>
        </div>

        {/* Hakkımda */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Hakkımda</h2>
          <p className="text-gray-700">
            5 yıllık frontend geliştirme deneyimine sahibim. Modern web
            teknolojileri konusunda uzmanlaşmış olup, kullanıcı deneyimini en
            üst düzeyde tutmayı hedefliyorum. Açık kaynak projelere katkıda
            bulunmayı ve toplulukla bilgi paylaşımını seviyorum.
          </p>
        </div>

        {/* Gönderiler*/}
<Posts />

      </div>
    </div>
  );
}
