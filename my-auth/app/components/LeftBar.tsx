"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import { FaBookmark } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { MdFavoriteBorder } from "react-icons/md";
import Followers from './Followers';
import Following from './Following';

function LeftBar() {
  const [isFollowersOpen, setIsFollowersOpen] = useState(false);
  const [isFollowingOpen, setIsFollowingOpen] = useState(false);
  return (
    <div className='flex  flex-col space-y-4'>
{/* Profil özeti */}
<div className='w-full bg-white rounded-md shadow-md'>
<div className="m-2" >
  <img
              src={"/5.jpg"}
              alt="Avatar"
              className="w-16 h-16 rounded-full border-2 border-white  object-cover"
            />
            <div className='p-2 '>
                <p className='font-bold text-xl'>Ahmet Yılmaz</p>
                <p>Yazılım geliştiricisi</p>
            </div>
         
  </div>

</div>

<div className='w-full bg-white rounded-md shadow-md '>
<ul className='p-4  space-y-3 text-sm'>
    <li className='flex justify-between  hover:underline'>
      <button onClick={()=>setIsFollowersOpen(true)} data-modal-target="default-modal" data-modal-toggle="default-modal" className='text-gray-600 cursor-pointer' type="button">
Followers
</button>
      <span className='text-blue-600 font-bold'>50</span></li>
    
    <li className='flex justify-between  hover:underline'>
  
      <button onClick={()=>setIsFollowingOpen(true)} data-modal-target="default-modal" data-modal-toggle="default-modal" className='text-gray-600 cursor-pointer' type="button">
      Following</button>
       <span className='text-blue-600 font-bold'>100</span>
</li>
    <li className='flex justify-between  hover:underline'>
      <Link href={"/post"} className='text-gray-600'>Gönderi Sayısı  </Link>
      <span className='text-blue-600 font-bold'>10</span></li>

</ul>
<Followers isFollowersOpen={isFollowersOpen} setIsFollowersOpen={setIsFollowersOpen} />
<Following isFollowingOpen={isFollowingOpen} setIsFollowingOpen={setIsFollowingOpen} />
</div>

<div className='w-full bg-white rounded-md shadow-md '>
<ul className='p-4  space-y-3 text-sm '>
    <li className='flex  space-x-4 hover:bg-gray-100 '><FaBookmark size={20} className='text-blue-500'/><Link href={"/Saves"} className=''>Kaydedilenler </Link></li>
    <li className='flex  space-x-4 '><SlCalender size={20} className='text-blue-500' /><Link href={"/etkinlik"} className=''>Etkinliklerim </Link></li>
    <li className='flex  space-x-4 '><MdFavoriteBorder size={20} className='text-blue-500' /><Link href={"/interest"} className=''>İlgi Alanlarım </Link></li>



</ul>

</div>
    </div>
  )
}

export default LeftBar
