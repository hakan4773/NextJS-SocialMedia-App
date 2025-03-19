"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaComment, FaHeart } from "react-icons/fa";
import { FiEdit2, FiSettings } from "react-icons/fi";

interface UserType {
  id: string;
  name: string;
  email: string;
  password: string;
  bio: string;
  profileImage: string;
}
interface Post {
  _id: string;
  content: string;
  tags: string[];
  image?: string;
  createdAt: string;
  comments:string[];
  likes:number
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserType | null>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading,setLoading]=useState(true)
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
        setPosts(data.posts);
      } else {
        console.error("Profil verisi alınamadı:", data.error);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

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
                className="rounded-full"
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
                <button className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200">
                  <FiSettings size={18} />
                  <span>Ayarlar</span>
                </button>
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

        {/* Son Aktiviteler */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-4xl mx-auto">
      {/* Kullanıcı Bilgisi */}
      <div className="flex items-center mb-6">
        <Image
          src={userData?.profileImage || "/profil.jpg"}
          alt="Profile"
          width={50}
          height={50}
          className="rounded-full border-2 border-indigo-500"
        />
        <div className="ml-4">
          <h3 className="text-xl font-semibold text-gray-800">{userData?.name || "Kullanıcı"}</h3>
          <p className="text-sm text-gray-500">{userData?.bio || "Biyografi yok"}</p>
        </div>
      </div>

      {/* Gönderiler Başlığı */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Gönderiler</h2>

      {/* Gönderiler Listesi */}
      {posts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">Henüz gönderi yok.</p>
          <p className="text-gray-400">İlk gönderini paylaşmaya ne dersin?</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-gray-50 rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Gönderi İçeriği */}
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                {post.content}
              </p>

              {/* Gönderi Resmi */}
              {post.image && (
                <div className="relative w-full h-64 sm:h-80 mb-4">
                  <Image
                    src={post.image}
                    alt="Post"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              )}

              {/* Gönderi Bilgileri ve Etkileşim */}
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <FaHeart className="text-red-500 mr-1" />
                    <span>{post.likes || 0} Beğeni</span>
                  </div>
                  <div className="flex items-center">
                    <FaComment className="text-blue-500 mr-1" />
                    <span>{post.comments || 0} Yorum</span>
                  </div>
                </div>
                <span>{new Date(post.createdAt).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
      </div>
    </div>
  );
}
