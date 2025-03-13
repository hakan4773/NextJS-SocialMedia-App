import Link from 'next/link'
import React from 'react'
import { FaBookmark } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { MdFavoriteBorder } from "react-icons/md";

function LeftBar() {
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
    <li className='flex justify-between  hover:underline'><Link href={"/followers"} className='font-semibold'>Followers  </Link><span className='text-blue-500'>50</span></li>
    <li className='flex justify-between  hover:underline'><Link href={"/following"} className='font-semibold'>Following  </Link><span className='text-blue-500'>100</span></li>
    <li className='flex justify-between  hover:underline'><Link href={"/post"} className='font-semibold'>Gönderi Sayısı  </Link><span className='text-blue-500'>10</span></li>

</ul>

</div>
<div className='w-full bg-white rounded-md shadow-md '>
<ul className='p-4  space-y-3 text-sm '>
    <li className='flex  space-x-4 hover:underline'><FaBookmark size={20} /><Link href={"/Saves"} className='font-semibold'>Kaydedilenler </Link></li>
    <li className='flex  space-x-4 hover:underline'><SlCalender size={20} /><Link href={"/etkinlik"} className='font-semibold'>Etkinliklerim </Link></li>
    <li className='flex  space-x-4 hover:underline'><MdFavoriteBorder size={20} /><Link href={"/interest"} className='font-semibold'>İlgi Alanlarım </Link></li>



</ul>

</div>
    </div>
  )
}

export default LeftBar
