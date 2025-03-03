"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import { PiLockKey } from "react-icons/pi";
import { IoClose, IoMenu } from "react-icons/io5";

function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
  return (
    <header className='flex justify-between p-4 bg-gray-200 min-w-full shadow-md  fixed top-0 w-full z-50'>
      <nav className='container mx-auto flex justify-between items-center'>

       <div className='flex items-center w-full '>
        <Link  href='/' className='flex items-center space-x-2 cursor-pointer'>

        <PiLockKey size={30}/>
        <h1 className='text-xl m-1 '> Authtentication</h1>
        </Link>
</div>

<div className='space-x-4 flex items-center hidden md:flex'>
<Link href='/login' >Login</Link>
<Link href='/register'>Register</Link>
</div>

<button onClick={()=>setIsOpen(!isOpen)} className='md:hidden '>
{isOpen ? <IoClose size={30} /> : <IoMenu size={30} />}</button>

{
    isOpen && (


        <div className="md:hidden  absolute top-full left-0 w-full bg-gray-200 p-4 space-y-4 shadow-md transition-all duration-300 flex justify-center items-center flex-col">
              
        <Link
          href="/login"
          className="block text-gray-700 hover:text-gray-900 "
        >
          Login
        </Link>
        <Link
          href="/register"
          className="block text-gray-700 hover:text-gray-900"
        >
          Register
        </Link>
      </div>
    )
}


</nav>

    </header>
  )
}

export default Navbar
