"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FiEdit2, FiFileText, FiSettings, FiUserPlus, FiUsers } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import Link from "next/link";
import Posts from "../components/Posts";
import GetSurveys from "../components/getSurveys";
import Activities from "../components/Activities";
import Followers from "../components/Followers";
import Following from "../components/Following";
import { Activity, Post, Survey, UserType } from "../types/user";

export default function ProfilePage() {
const [userData, setUserData] = useState<UserType | null>(null);
const [posts, setPosts] = useState<Post[]>([]);
const [surveys,setSurveys]=useState<Survey[]>([])
const [activities,setActivities]=useState<Activity[]>([]);
  const [isFollowersOpen, setIsFollowersOpen] = useState(false);
  const [isFollowingOpen, setIsFollowingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
const [activeTab,setActiveTab]=useState<'posts' | 'surveys' | 'activities'>('posts');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUserData(data.user);
        setPosts(data.posts || []);
        setSurveys(data.surveys || [])
        setActivities(data.activities || []);
        setLoading(false);
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
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
     <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
    {/* Profil Fotoğrafı */}
    <div className="relative mx-auto md:mx-0">
      <div className="relative">
        <Image
          src={userData?.profileImage || "/profil.jpg"}
          alt="Profil Fotoğrafı"
          width={120}
          height={120}
          className="rounded-full w-24 h-24 md:w-32 md:h-32 border-2 border-gray-300 object-cover"
        />
        <button 
          className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600 transition-colors"
          aria-label="Profil fotoğrafını düzenle"
        >
          <FiEdit2 size={16} />
        </button>
      </div>
    </div>

    {/* Profil Bilgileri */}
    <div className="flex-1 w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex justify-center text-center flex-col">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 break-words">
            {userData?.name}
          </h1>

          <p className="text-gray-600 text-sm md:text-base">{userData?.email}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 relative">
  <Link
    href="/profile/edit"
    className="flex items-center justify-center space-x-2 text-white bg-red-500 px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm md:text-base"
  >
    <CiEdit size={18} />
    <span>Güncelle</span>
  </Link>

  <div className="relative">
    <button
      onClick={() => setIsSettingsOpen(!isSettingsOpen)}
      className="flex items-center justify-center space-x-2 w-full bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm md:text-base"
      aria-label="Ayarlar"
    >
      <FiSettings size={18} />
      <span>Ayarlar</span>
    </button>

    {isSettingsOpen && (
      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg z-20">
        <ul className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
          <li className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Hesap Ayarları</li>
          <li className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Gizlilik Ayarları</li>
          <li className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Çıkış Yap</li>
        </ul>
      </div>
    )}
  </div>
</div>
      </div>

      {/* Bio ve Açıklama */}
      <div className="mt-3 space-y-2 text-center md:text-left">
        {userData?.bio && (
          <p className="text-gray-700 text-sm md:text-base break-words">
            {userData.bio}
          </p>
        )}
     
      </div>
    </div>
  </div>
</div>

        {/* İstatistikler */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
  {/* Paylaşımlar Kartı */}
  <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-base font-medium text-gray-500">Paylaşımlar</h3>
        <p className="text-3xl font-bold text-blue-600 mt-1">
          {(userData?.posts?.length || 0) + 
           (userData?.surveys?.length || 0) + 
           (userData?.activities?.length || 0)}
        </p>
      </div>
      <div className="bg-blue-50 p-3 rounded-full">
        <FiFileText className="text-blue-500 text-xl" />
      </div>
    </div>
    <p className="text-xs text-gray-400 mt-2">Toplam paylaşım sayısı</p>
  </div>

  {/* Takipçiler Kartı */}
  <div 
    className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 cursor-pointer"
    onClick={() => setIsFollowersOpen(true)}
  >
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-base font-medium text-gray-500">Takipçiler</h3>
        <p className="text-3xl font-bold text-purple-600 mt-1">
          {userData?.followers?.length || 0}
        </p>
      </div>
      <div className="bg-purple-50 p-3 rounded-full">
        <FiUsers className="text-purple-500 text-xl" />
      </div>
    </div>
    <p className="text-xs text-gray-400 mt-2">Profilini takip edenler</p>
  </div>

  {/* Takip Edilenler Kartı */}
  <div 
    className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 cursor-pointer"
    onClick={() => setIsFollowingOpen(true)}
  >
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-base font-medium text-gray-500">Takip Edilenler</h3>
        <p className="text-3xl font-bold text-green-600 mt-1">
          {userData?.following?.length || 0}
        </p>
      </div>
      <div className="bg-green-50 p-3 rounded-full">
        <FiUserPlus className="text-green-500 text-xl" />
      </div>
    </div>
    <p className="text-xs text-gray-400 mt-2">Takip ettiğin kişiler</p>
  </div>

  {/* Modaller */}
  <Followers isFollowersOpen={isFollowersOpen} setIsFollowersOpen={setIsFollowersOpen} />
  <Following isFollowingOpen={isFollowingOpen} setIsFollowingOpen={setIsFollowingOpen} />
</div>


        {/* Gönderiler*/}
        <div className="bg-white border-slate-100 shadow-md rounded-lg mb-6">
          <ul className="flex items-center justify-center  p-4 space-x-6">
          
              <li className="text-gray-800 font-semibold text-lg  ">
                  <button  onClick={()=>setActiveTab("posts")} className={`${activeTab==="posts" ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-800'}`}
               >
                Gönderiler</button>
              </li>
            
           
                  <li className="text-gray-800 font-semibold text-lg "> 
                    <button onClick={()=>setActiveTab("surveys")} className={`${activeTab==="surveys" ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-800'}`}
                    >Anketler</button></li> 

        
               
                  <li className="text-gray-800 font-semibold text-lg ">
                       <button onClick={()=>setActiveTab("activities")} className={`${activeTab==="activities" ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-800'}`} 
                     >Etkinlikler</button></li> 
          </ul>

{activeTab === "posts" && (
  <>
    {posts?.map((item: Post, index: number) => (
      <Posts key={index} item={item} />
    ))}
  </>
)}
{activeTab==="surveys"  && (
       <>
       {surveys?.map((item: Survey, index: number) => (
         <GetSurveys key={index} item={item} />
       ))}
     </>
)
}
{activeTab==="activities"  &&
  <>
  {activities?.map((item: Activity, index: number) => (
    <Activities key={index} item={item} />
  ))}
</>

}  
        </div>
      </div>
    </div>
  );
}
