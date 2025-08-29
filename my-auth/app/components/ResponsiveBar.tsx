"use client"
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaBookmark } from 'react-icons/fa'
import { IoMenu } from 'react-icons/io5'
import { MdFavoriteBorder } from 'react-icons/md'
import { SlCalender } from 'react-icons/sl'
import { getUserDetails } from '../utils/getUsers'
import { UserType } from '../types/user'
import Followers from './Followers'
import Following from './Following'
import Trends from './Trends'
function ResponsiveBar() {
    
    const [isOpen, setIsOpen] = useState(false);
    const toggleSidebar = () => setIsOpen(!isOpen);
    const [userData,setUserData]=useState<UserType |null>()
     const [isFollowersOpen, setIsFollowersOpen] = useState(false);
      const [isFollowingOpen, setIsFollowingOpen] = useState(false);
   
     useEffect(()=>{
       if (typeof window !== "undefined") {

     const fetchData=async()=>{
     const userData=await getUserDetails();
     setUserData(userData.user)
     }
     fetchData();
    }
     },[])
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
        className="lg:w-16 lg:h-16 w-12 h-12 rounded-full border-2 border-white shadow-lg object-cover hover:scale-105 transition-transform duration-200"
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
                <button onClick={()=>setIsFollowersOpen(true)
                                      
                } data-modal-target="default-modal" data-modal-toggle="default-modal" className='text-gray-600 cursor-pointer' type="button">
                  <span className="block font-bold text-blue-600">   {userData?.followers?.length || 0}</span> 
                <span className="text-gray-600">Followers</span>   </button>
              </li>
              <li className=" text-center">
                <button onClick={()=>setIsFollowingOpen(true)
                 
                } data-modal-target="default-modal" data-modal-toggle="default-modal" className='text-gray-600 cursor-pointer' type="button">
                <span className="block font-bold text-blue-600">   {userData?.following?.length || 0}</span>   
                <span className="text-gray-600">Following</span>  </button>
              </li>
              <li className=" text-center">
                <Link href={"/profile"} className="">
                  <span className="block font-bold text-blue-600">  {(userData?.posts?.length || 0) + 
           (userData?.surveys?.length || 0) + 
           (userData?.activities?.length || 0)}</span>
                <span className="text-gray-600">Gönderi Sayısı</span>
                 </Link>
              </li>
            </ul>
           
          </div>


          <div className=" flex-1 overflow-y-auto ">
            <ul className="p-6  space-y-4 ">
              <li className=" ">

                <Link href={"/Bookmark"} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                 <FaBookmark size={20} className="text-blue-500"/> 
                 <span className='font-medium'>Kaydedilenler</span>                    </Link>
              </li>
              <li className=" ">

                <Link href={"/Bookmark/Activities"} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                     <SlCalender size={20} className="text-blue-500" />
                     <span className='font-medium'>Etkinliklerim</span>
                </Link>
              </li>
            </ul>
      
            <div className="mb-6    p-4">

      <Trends />

   
    </div>
      
      
          </div>

        
        </div>
      </div>
    )}
                <Followers isFollowersOpen={isFollowersOpen}  setIsFollowersOpen={setIsFollowersOpen} />
                <Following isFollowingOpen={isFollowingOpen} setIsFollowingOpen={setIsFollowingOpen} />
  </div>

  )
}

export default ResponsiveBar
