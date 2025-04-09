"use client";
import Image from "next/image";
import Link from "next/link";
import {
  FiBookmark,
  FiCheck,
  FiEdit2,
  FiEye,
  FiFileText,
  FiHeart,
  FiMapPin,
  FiMessageCircle,
  FiSettings,
  FiShare,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi";
import { PiDotsThreeBold } from "react-icons/pi";
import { MdDeleteOutline } from "react-icons/md";
import { TiPinOutline } from "react-icons/ti";
import { CiEdit } from "react-icons/ci";
import { IoStatsChartOutline } from "react-icons/io5";
import { format } from "timeago.js";
import { use, useEffect, useState } from "react";
import { SlUserFollow } from "react-icons/sl";
import GetSurveys from "@/app/components/getSurveys";
import { tr } from 'date-fns/locale'
import Interaction from "../components/Interaction";
import Followers from "@/app/components/Followers";
import Following from "@/app/components/Following";
interface UserType {
  _id: number;
  name: string;
  email: string;
  password: string;
  bio: string;
  profileImage: string;
  followers: string[];
  following: string[];
}

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
interface Survey{
  _id:string;
  question:string;
  choices:{
       text: string;
        voters: string[];
  };
  duration:{
      days:number;
      hours:number;
      minutes:number;
  }
  creator:string;
  endDate:Date;
  isActive: boolean;
}
interface Activity{
  activityName: string;
    activityType: string;
    description: string;
    creator: {
      profileImage: string;
      name: string;
    };
    activityDate: {
      hours: number;
      minutes: number;
    };
    startDate: Date;
    isActive: boolean;
    createdAt:Date;
}
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
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState<Record<number, boolean>>({});
  const [openSettingIndex, setOpenSettingIndex] = useState<number | null>(null);
  const [isFollowing, setIsFollowing] =useState(false);
 const [votedSurveyId, setVotedSurveyId] = useState<string | null>(null); // Oy verilen anketin ID’si
  const [votedChoiceIndex, setVotedChoiceIndex] = useState<number | null>(null); // Oy verilen seçenek index’i
 const [activeTab,setActiveTab]=useState<'posts' | 'surveys' | 'activities'>('posts')
 const [isFollowersOpen, setIsFollowersOpen] = useState(false);
  const [isFollowingOpen, setIsFollowingOpen] = useState(false);
  const toggleSetting = (index: any) => {
    setOpenSettingIndex(openSettingIndex === index ? null : index);
  };

  {
    /*Kullanıcı bilgisini alma */
  }
  useEffect(() => {
    const fetchProfile = async () => {
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

  const handleShare=(id:number,content:string)=>{
    const postUrl=`${window.location.origin}/post/${id}`
    
    if(navigator.share){
    navigator.share({
    title:"Paylaşım",
    text:content,
    url:postUrl
    }).catch((error)=>console.error("Paylaşım hatası",error))
    
    }
    else {
      alert("paylaşım desteklenmiyor")
    }
  }

  const handleComment = (id: number) => {
    setComment((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  {
    /*Kullanıcı takip etme */
  }
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

  if (loading) return <p>Loading...</p>;

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
             
             <div className="flex flex-col sm:flex-row gap-2">
               <Link
                 href="/profile/edit"
                 className="flex items-center justify-center space-x-2 text-white bg-red-500 px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm md:text-base"
               >
                 <CiEdit size={18} />
                 <span>Güncelle</span>
               </Link>
               <button 
                 className="flex items-center justify-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm md:text-base"
                 aria-label="Ayarlar"
               >
                 <FiSettings size={18} />
                 <span>Ayarlar</span>
               </button>
             </div>
           </div>
     
           {/* Bio ve Açıklama */}
           <div className="mt-3 space-y-2">
             {userData?.bio && (
               <p className="text-gray-700 text-sm md:text-base break-words">
                 {userData.bio}
               </p>
             )}
             <p className="text-gray-700 text-sm md:text-base">
               5 yıllık frontend geliştirme deneyimine sahibim. Modern web
               teknolojileri konusunda uzmanlaşmış olup, kullanıcı deneyimini en
               üst düzeyde tutmayı hedefliyorum. Açık kaynak projelere katkıda
               bulunmayı ve toplulukla bilgi paylaşımını seviyorum.
             </p>
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
  {/* <Followers isFollowersOpen={isFollowersOpen} setIsFollowersOpen={setIsFollowersOpen} />
  <Following isFollowingOpen={isFollowingOpen} setIsFollowingOpen={setIsFollowingOpen} /> */}
</div>

   

        {/* Gönderiler*/}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8  mx-auto ">
       

          {/* Paylaşımlar Listesi */}

<ul className="flex items-center justify-center p-4 space-x-6 text-xl font-semibold">
  <li><button className={`${activeTab==="posts" ? "border-blue-500 text-blue-600":"border-transparent text-gray-800"}`} onClick={() => setActiveTab('posts')}>Gönderiler</button></li>
  <li><button className={`${activeTab==="surveys" ? "border-blue-500 text-blue-600":"border-transparent text-gray-800"}`} onClick={() => setActiveTab('surveys')}>Anketler</button></li>
  <li><button className={`${activeTab==="activities" ? "border-blue-500 text-blue-600":"border-transparent text-gray-800"}`} onClick={() => setActiveTab('activities')}>Etkinlikler</button></li>
</ul>
{activeTab==="posts" && 
         posts && posts.length > 0 ? (
            posts?.map((post, index) => (
              <div 
                key={index} 
                className="p-5 hover:bg-gray-50  cursor-pointer  bg-white shadow-sm hover:shadow-md transition-shadow duration-400 border border-gray-100"
              >
                {/* Üst Bilgi - Kullanıcı Bilgileri */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Image
                        src={userData?.profileImage || "/default-profile.jpg"}
                        alt="Profile"
                        width={44}
                        height={44}
                        className="rounded-full border-2 border-blue-100"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                        <FiCheck className="text-white text-xs" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-800">{userData?.name}</h3>
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Takip Ediyor</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{"@"+userData?.email.split('@')[0]}</span>
                        <span>•</span>
                        <span>{format(post?.createdAt)}</span>
                      </div>
                    </div>
                  </div>
        
                  {/* Ayarlar Butonu */}
                  <div className="relative">
                    <button
                      onClick={() => toggleSetting(index)}
                      className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                    >
                      <PiDotsThreeBold size={20} />
                    </button>
                    
                    {openSettingIndex === index && (
                      <div className="absolute right-0 top-8 mt-1 w-48 bg-white rounded-md shadow-xl z-50 border border-gray-100">
                        {[
                          { icon: <MdDeleteOutline className="text-red-500" />, text: "Sil" },
                          { icon: <CiEdit />, text: "Düzenle" },
                          { icon: <TiPinOutline />, text: "Profile Sabitle" },
                          { icon: <IoStatsChartOutline />, text: "İstatistikler" }
                        ].map((item, i) => (
                          <button
                            key={i}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                          >
                            <span>{item.icon}</span>
                            <span>{item.text}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>


                </div>
        
                {/* Post İçeriği */}
                <div className="mt-3 pl-2">
                  <p className="text-gray-800 leading-relaxed">{post.content}</p>
                  
                  {post.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="text-blue-500 text-xs bg-blue-50 px-2 py-1 rounded-full hover:bg-blue-100 cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {post.image && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-gray-100">
                      <Image
                        src={post.image}
                        alt="Post"
                        width={600}
                        height={300}
                        className="w-full h-auto object-cover"
                        layout="responsive"
                      />
                    </div>
                  )}
                </div>
        
                {/* Etkileşim Butonları */}
            <Interaction post={post}/>

              </div>
            ))
          ) : (
           ""
)

}

{/* Anketler */}
{activeTab==="surveys" &&
<GetSurveys />
}

{activeTab==="activities" &&
activities && activities.length > 0 ? (
    activities.map((post, index) => (
      <div 
        key={index} 
        className="p-5  bg-white shadow-sm hover:shadow-md  hover:bg-gray-50  cursor-pointer transition-shadow duration-200 border border-gray-100 overflow-hidden"
      >
        {/* Üst Bilgi - Kullanıcı Bilgileri */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Image
                src={post.creator.profileImage}
                alt="Profile"
                width={44}
                height={44}
                className="rounded-full border-2 border-blue-100"
              />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">{post?.creator.name}</h3>
              <p className="text-xs text-gray-500">
                {format(new Date(post.createdAt), "dd.MM.yyyy HH:mm")}
              </p>
            </div>
          </div>

          {/* Ayarlar Butonu */}
          <div className="relative">
            <button
              onClick={() => toggleSetting(index)}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <PiDotsThreeBold size={20} />
            </button>
            
            {openSettingIndex === index && (
              <div className="absolute right-0 top-8 mt-1 w-48 bg-white rounded-md shadow-xl z-50 border border-gray-100">
                {[
                  { icon: <MdDeleteOutline className="text-red-500" />, text: "Sil" },
                  { icon: <CiEdit />, text: "Düzenle" },
                  { icon: <TiPinOutline />, text: "Profile Sabitle" },
                  { icon: <IoStatsChartOutline />, text: "İstatistikler" }
                ].map((item, i) => (
                  <button
                    key={i}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Etkinlik Görseli */}
        <div className="relative rounded-lg overflow-hidden mb-3 border border-gray-100">
          <Image
            src={"/image/yedo.jpg"}
            alt="Etkinlik Görseli"
            width={600}
            height={300}
            className="w-full h-48 object-cover"
            layout="responsive"
          />
          {/* Etkinlik tarih badge */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
            <p className="font-bold text-sm text-gray-800">
              {/* {format(new Date(post.startDate), "eee, d MMM yyyy", { locale: tr })} •  */}
              <span className="text-blue-600 ml-1">
                {post.activityDate.hours}:{post.activityDate.minutes.toString().padStart(2, '0')}
              </span>
            </p>
          </div>
        </div>

        {/* Etkinlik Detayları */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-gray-900">{post?.activityName}</h3>
          
          <div className="flex items-center text-sm text-gray-600">
            <FiMapPin className="mr-2 text-gray-400" />
            <span>Etkinlik Yeri: <b className="text-gray-800">{post.activityType}</b></span>
          </div>
          
          {post.description && (
            <p className="text-gray-600 text-sm line-clamp-2">
              {post.description}
            </p>
          )}
          
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center text-sm text-gray-500">
              <FiUsers className="mr-1" />
              <span>{20} katılımcı</span>
            </div>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center">
              <FiEye className="mr-2" />
              Etkinliği Görüntüle
            </button>
          </div>
        </div>
      </div>
    ))
  ) : (
  ""
  )
}

          
        </div>

      </div>
    </div>
  );
}
