"use client"
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaBookmark } from 'react-icons/fa'
import { FaArrowTrendUp } from 'react-icons/fa6'
import { IoMenu } from 'react-icons/io5'
import { MdFavoriteBorder } from 'react-icons/md'
import { SlCalender } from 'react-icons/sl'
import { User } from '../types/user'
import { getUserDetails } from '../utils/getUsers'
import { PiDotsThreeBold } from 'react-icons/pi'
import { UserType } from '../types/user'
function ResponsiveBar() {
    
    const [isOpen, setIsOpen] = useState(false);
    const toggleSidebar = () => setIsOpen(!isOpen);
    const [openSettingIndex, setOpenSettingIndex] = useState<number | null>(null);
    const [userData,setUserData]=useState<UserType |null>()
    
    const toggleSetting=(index:any)=>{
      setOpenSettingIndex(openSettingIndex === index ? null: index)
    }
     useEffect(()=>{
     
     const fetchData=async()=>{
     const userData=await getUserDetails();
     setUserData(userData.user)
     }
     fetchData();
     
     },[])
      const trends = [
        { tag: "#Tatil", count: 150,categories:"Tatil" },
        { tag: "#Yemek", count: 100 ,categories:"Yemek"},
        { tag: "#Beşiktaş", count: 80 ,categories:"Spor"},
      ];
    
  return (
    <div className="relative md:hidden block ">
    <button className="fixed top-2 left-4 z-50  text-white p-3 cursor-pointer ">
      <IoMenu size={25} onClick={toggleSidebar} />
    </button>

    <div
      className={`fixed bg-black/50 inset-0  backdrop-blur-sm z-40  ${
        isOpen ? "translate-x-0 opacity-100" : "-translate-x-full"
      }`}
      onClick={toggleSidebar}
    />

    {isOpen && (
      <div
        className={`fixed top-0 left-0 w-80 h-full bg-white scroll-auto transform transition-transform duration-300 z-50  ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
         <div className='w-full flex flex-col h-full'>
  {/* Profil Bölümü */}
  <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center space-x-4">
    <Link href="/profile" className="flex items-center space-x-4">
      <img
        src={userData?.profileImage}
        alt="Avatar"
        className="w-16 h-16 rounded-full border-2 border-white shadow-lg object-cover hover:scale-105 transition-transform duration-200"
      />
     
    </Link> <div className='text-white'>
        <p className='font-bold text-xl'>{userData?.name}</p>
        <p className="opacity-90">{userData?.bio ||<Link href={"/profile/edit"}>Profil yazısı ekleyin ✏️</Link>}</p>
      </div>
  </div>

          
{/* istatistikler */}
          <div className="  border-t py-4 bg-gray-50 ">
            <ul className="px-6 flex justify-between text-sm">
              <li className="text-center">
                <Link href={"/followers"} className="">
                  <span className="block font-bold text-blue-600"> 50</span> 
                <span className="text-gray-600">Followers</span>   </Link>
              </li>
              <li className=" text-center">
                <Link href={"/following"} className="">
                <span className="block font-bold text-blue-600"> 100</span>   
                <span className="text-gray-600">Following</span>  </Link>
              </li>
              <li className=" text-center">
                <Link href={"/post"} className="">
                  <span className="block font-bold text-blue-600"> 10</span>
                <span className="text-gray-600">Gönderi Sayısı</span>
                 </Link>
              </li>
            </ul>
          </div>


          <div className=" flex-1 overflow-y-auto ">
            <ul className="p-6  space-y-4 ">
              <li className=" ">
              
                <Link href={"/Saves"} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                 <FaBookmark size={20} className="text-blue-500"/> 
                 <span className='font-medium'>Kaydedilenler</span>                    </Link>
              </li>
              <li className=" ">
            
                <Link href={"/etkinlik"} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                     <SlCalender size={20} className="text-blue-500" />
                     <span className='font-medium'>Etkinliklerim</span>
                </Link>
              </li>
              <li className="">
              
                <Link href={"/interest"} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <MdFavoriteBorder size={20} className="text-blue-500" />
                  <span className='font-medium'>İlgi Alanlarım</span>
                  </Link>
              </li>
            </ul>
      
            <div className="mx-6 mb-6 bg-gray-50 rounded-xl p-4">
      <h3 className="text-lg font-semibold flex items-center text-gray-800">
        <FaArrowTrendUp className="mr-2 text-blue-500" />
        Trendler
      </h3>
      <div className="pt-2">
<input className="border border-gray-400 rounded-full flex justify-center p-2" placeholder="Ara..."></input>
</div>
      <ul className="mt-4 space-y-3">
        {trends.map((trend, index) => (
          <div key={trend.tag} className="relative group">
            <div className="absolute right-2 top-2">
              <button 
                onClick={() => toggleSetting(index)}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <PiDotsThreeBold className="text-gray-500" />
              </button>

              {openSettingIndex === index && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
                  <button className=" px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors">
                    Bunu önerme
                  </button>
                  <button className=" px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors">
                    Spam
                  </button>
                </div>
              )}
            </div>

            <Link href="/tweets" className="block p-3 rounded-lg hover:bg-white transition-colors">
              <div className="text-sm text-blue-500 font-semibold">{trend.tag}</div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">{trend.count} paylaşım</span>
                <span className="text-xs text-gray-400">{trend.categories}</span>
              </div>
            </Link>
          </div>
        ))}

        <button className="w-full py-2 text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors">
          Daha Fazla Göster
        </button>
      </ul>
    </div>
      
      
          </div>

        
        </div>
      </div>
    )}
  </div>

  )
}

export default ResponsiveBar
