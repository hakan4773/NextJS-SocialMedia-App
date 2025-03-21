"use client";
import Image from "next/image";
import Link from "next/link";
import { format } from "path";
import { use, useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FiEdit2, FiSettings } from "react-icons/fi";

 interface UserType {
   _id:  number;
   name: string;
   email: string;
   password: string;
   bio: string;
   profileImage: string;
 }

 interface Post {
   _id: number;
   content: string;
   tags: string[];
   image?: string;
   createdAt: string;
   comments: string[];
   likes: number;
 }

 export default function ProfilePage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = use(params); 
   const [userData, setUserData] = useState<UserType | null>(null);
   const [posts, setPosts] = useState<Post[]>([]);
   const [loading, setLoading] = useState(true);
   useEffect(() => {
     const fetchProfile = async () => {
  if (!id) {
	console.error("No ID provided in the URL.");
	setLoading(false);
	return;
  }
       const res = await fetch(`/api/users/${id}`);
       const data = await res.json();
       if (res.ok) {
         setUserData(data.user);
       } else {
         console.error("Profil verisi alınamadı:", data.error);
       }
       setLoading(false);
     };

     fetchProfile();
   }, []);

   if (loading) return <p>Loading...</p>;

   return (

    <div className="min-h-screen bg-gradient-to-b from-indigo-700 via-purple-600 to-pink-400  py-24">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profil Başlığı */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Image
                src={userData?.profileImage || "/profil.jpg"}
                alt="Profil Fotoğrafı"
                width={120}
                height={120}
                className="rounded-full w-32 h-32"
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
                <div className="flex space-x-2 ">
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
        </div>
       </div>
   )
}