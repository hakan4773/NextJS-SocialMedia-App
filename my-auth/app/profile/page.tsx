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

interface UserType {
  id: string;
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

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserType | null>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState<Record<number, boolean>>({});

  const [openSettingIndex, setOpenSettingIndex] = useState<number | null>(null);
  const toggleSetting = (index: any) => {
    setOpenSettingIndex(openSettingIndex === index ? null : index);
  };
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

  const handleComment = (id: number) => {
    setComment((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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

        {/* Gönderiler*/}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8  mx-auto ">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
            Gönderiler
          </h2>

          {/* Gönderiler Listesi */}
          {posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">Henüz gönderi yok.</p>
              <p className="text-gray-400">
                İlk gönderini paylaşmaya ne dersin?
              </p>
            </div>
          ) : (
            <div className="space-y-6 ">
              {posts.map((post, index) => (
                <div
                  key={post._id}
                  className="rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300 "
                >
                  {/* Kullanıcı Bilgisi */}
                  <div className="flex items-center ">
                    <Image
                      src={userData?.profileImage || "/profil.jpg"}
                      alt="Profile"
                      width={50}
                      height={50}
                      className="rounded-full border-2 border-indigo-500"
                    />
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {userData?.name || "Kullanıcı"}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed ">
                    {format(post?.createdAt)}
                  </p>
                    </div>
                  </div>
                  {/* seçenekler */}
                  <div className="relative  flex justify-end ">
                    <button
                      onClick={() => toggleSetting(index)}
                      className=" cursor-pointer"
                    >
                      <PiDotsThreeBold size={25} />
                    </button>

                    {openSettingIndex === index && (
                      <div className="absolute right-0 top-full mt-2 p-2 w-52 font-semibold bg-white rounded-lg shadow-lg z-50">
                        <div className="max-h-96 overflow-y-auto">
                          <p className="relative p-2 hover:bg-gray-50 cursor-pointer flex space-x-4">
                            <MdDeleteOutline
                              className="text-red-500"
                              size={25}
                            />
                            <span>Sil</span>
                          </p>
                          <p className="relative p-2 hover:bg-gray-50 cursor-pointer flex space-x-4">
                            <CiEdit size={25} />
                            <span>Düzenle</span>
                          </p>
                          <p className="relative p-2 hover:bg-gray-50 cursor-pointer flex space-x-4">
                            <TiPinOutline size={25} />
                            <span>Profile Sabitle</span>{" "}
                          </p>
                          <p className="relative p-2 hover:bg-gray-50 cursor-pointer flex space-x-4">
                            <IoStatsChartOutline size={25} />
                            <span>Post istatistiklerini görüntüle</span>
                          </p>
                        </div>{" "}
                      </div>
                    )}
                  </div>
                  {/* Gönderi İçeriği */}
                  <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-2">
                    {post.content}
                  </p>
                {/* tagler   */}
                  <div className=" flex space-x-2 mb-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-blue-400 text-sm">
              {tag}
              </span>
            ))} 
          </div>
                
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

                  {/*Etkileşim */}
                  <div className="mt-4 flex justify-between items-center ">
                    <button
                      onClick={() => handleComment(post?._id)}
                      className="flex items-center space-x-1 hover:text-blue-400"
                    >
                      <FiMessageCircle size={20} />
                      <span>Yorum</span>
                    </button>

                    <button className="flex items-center space-x-1 hover:text-red-400">
                      <FiHeart size={20} />
                      <span>{0}</span>
                    </button>
                    <button
                      //  onClick={() => handleShare(post.id, post.content)}
                      className="flex items-center space-x-1 hover:text-green-400 cursor-pointer"
                    >
                      <FiShare size={20} />
                      <span>Paylaş</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-yellow-400">
                      <FiBookmark size={20} />
                      <span>Kaydet</span>
                    </button>
                  </div>
                  {comment[post._id] && (
                    <div className="flex mt-2 space-x-2">
                      <input
                        className="border rounded-xl bg-gray-200 w-full  p-2"
                        placeholder="Yorum yaz..."
                      />
                      <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 cursor-pointer"
                      >
                        Gönder
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
