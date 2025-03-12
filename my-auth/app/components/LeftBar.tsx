import Link from 'next/link'
import React from 'react'

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
<ul className='p-4  space-y-3 '>
    <li className='flex justify-between  hover:underline'><Link href={"/followers"} className='font-semibold'>Followers  </Link><span className='text-blue-500'>50</span></li>
    <li className='flex justify-between  hover:underline'><Link href={"/following"} className='font-semibold'>Following  </Link><span className='text-blue-500'>100</span></li>
    <li className='flex justify-between  hover:underline'><Link href={"/post"} className='font-semibold'>Gönderi Sayısı  </Link><span className='text-blue-500'>10</span></li>

</ul>

</div>

    </div>
  )
}

export default LeftBar
