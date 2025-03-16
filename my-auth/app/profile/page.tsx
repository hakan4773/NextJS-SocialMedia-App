"use client"
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { FiEdit2, FiSettings } from 'react-icons/fi'
import { User } from '../types/user'
import { getUserDetails } from '../utils/getUsers'

export default function ProfilePage() {
const [userData,setUserData]=useState<User |null>()

useEffect(()=>{

const fetchData=async()=>{
const userData=await getUserDetails();
setUserData(userData.user)
}
fetchData();

},[])

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-700 via-purple-600 to-pink-400  py-24">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Profil Başlığı */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Image
                src="/5.jpg"
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
                <h1 className="text-2xl font-bold text-gray-800">{userData?.name}</h1>
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
            <h3 className="text-lg font-semibold text-gray-700">Takip Edilenler</h3>
            <p className="text-2xl font-bold text-blue-500 mt-2">348</p>
          </div>
        </div>

        {/* Hakkımda */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Hakkımda</h2>
          <p className="text-gray-700">
            5 yıllık frontend geliştirme deneyimine sahibim. Modern web teknolojileri konusunda 
            uzmanlaşmış olup, kullanıcı deneyimini en üst düzeyde tutmayı hedefliyorum. 
            Açık kaynak projelere katkıda bulunmayı ve toplulukla bilgi paylaşımını seviyorum.
          </p>
        </div>

        {/* Son Aktiviteler */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Son Aktiviteler</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border-b pb-4 last:border-0">
                <p className="text-gray-700">Yeni bir makale paylaştı: "Next.js 13 ile SSR"</p>
                <p className="text-sm text-gray-500 mt-1">2 saat önce</p>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  )
} 