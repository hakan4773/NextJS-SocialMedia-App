"use client";
import Image from "next/image";
import Link from "next/link";
import {
  FiEdit2,
  FiFileText,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { use, useEffect, useState } from "react";
import { SlUserFollow } from "react-icons/sl";
import Followers from "@/app/components/Followers";
import Following from "@/app/components/Following";
import { UserType } from "@/app/types/user";
import { Post } from "@/app/types/user";
import { Survey } from "@/app/types/user";
import { Activity } from "@/app/types/user";
import Posts from "@/app/profile/Contents/Posts";
import Activities from "@/app/profile/Contents/Activities";
import Surveys from "@/app/profile/Contents/Surveys";
import Loading from "../../loading";
export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = use(params);
  const [userData, setUserData] = useState<UserType | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [surveys,setSurveys]=useState<Survey[]>([]);
  const [activities,setActivities]=useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFollowing, setIsFollowing] =useState(false);
 const [activeTab,setActiveTab]=useState<'posts' | 'surveys' | 'activities'>('posts')
 const [isFollowersOpen, setIsFollowersOpen] = useState(false);
  const [isFollowingOpen, setIsFollowingOpen] = useState(false);

  {/*Kullanıcı bilgisini alma */}
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      if (!id) {
        console.error("No ID provided in the URL.");
        setLoading(false);
        return;
      }
      const res = await fetch(`/api/users/${id}`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      });
      const data = await res.json();
      if (res.ok) {
        setUserData(data.user);
        setPosts(data.posts);
        setSurveys(data.surveys);
        setActivities(data.activities);
        setIsFollowing(data.isFollowing); 
      } else {
        console.error("Profil verisi alınamadı:", data.error);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [id]);



  {/*Kullanıcı takip etme */}
  const handleFollow = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/users/followers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        followingId: id,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setIsFollowing(data.isFollowing)
        } else {
      alert(data.message);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-700 via-purple-600 to-pink-400  py-24">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profil Başlığı */}
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
        
  <div className="flex lg:space-x-2 lg:space-y-0 space-y-4 lg:flex-row flex-col">
                  <Link
                    href={"/profile/edit"}
                    className="flex items-center space-x-2 text-white bg-black px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    <CiEdit size={18} />
                    <span> Mesaj</span>
                  </Link>
                  <button
                    onClick={handleFollow}
  
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                      isFollowing ? "bg-gray-500 text-white" : "bg-blue-500 text-white hover:bg-blue-300"
                    }`}                  >
                    <SlUserFollow size={18} />
                    <span>{isFollowing ? "Takip Ediliyor" : "Takip Et"}</span>
                  </button>{" "}
                </div>
      </div>

      {/* Bio ve Açıklama */}
      <div className="mt-3 space-y-2">
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
          {(posts?.length || 0) + 
           (surveys?.length || 0) + 
           (activities?.length || 0)}
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
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8  mx-auto ">
          {/* Paylaşımlar Listesi */}
<ul className="flex items-center justify-center p-4 space-x-6 text-xl font-semibold">
  <li><button className={`${activeTab==="posts" ? "border-blue-500 text-blue-600":"border-transparent text-gray-800"}`} onClick={() => setActiveTab('posts')}>Gönderiler</button></li>
  <li><button className={`${activeTab==="surveys" ? "border-blue-500 text-blue-600":"border-transparent text-gray-800"}`} onClick={() => setActiveTab('surveys')}>Anketler</button></li>
  <li><button className={`${activeTab==="activities" ? "border-blue-500 text-blue-600":"border-transparent text-gray-800"}`} onClick={() => setActiveTab('activities')}>Etkinlikler</button></li>
</ul>
{activeTab==="posts" &&  <Posts  userId={userData?._id}/>}
{activeTab==="surveys" && <Surveys userId={userData?._id}/>}
{activeTab==="activities" && <Activities userId={userData?._id}/>}       
        </div>
      </div>
    </div>
  );
}
