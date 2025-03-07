"use client"
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { PiLockKey } from "react-icons/pi";
import { IoClose, IoMenu } from "react-icons/io5";
import {useAuth} from "../context/AuthContext"
function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const {user,logout}=useAuth();

    useEffect(() => {
      console.log("Navbar user:", user); 
    }, [user]);
  return (
    <header className='flex justify-between p-4 bg-gray-200 min-w-full shadow-md  fixed top-0 w-full z-50'>
      <nav className='container mx-auto flex justify-between items-center'>
       <div className='flex items-center w-full '>
        <Link  href='/' className='flex items-center space-x-2 cursor-pointer'>
        <PiLockKey size={30}/>
        <h1 className='text-xl m-1 '> Authtentication</h1>
        </Link>
</div>

<div className='space-x-4  items-center hidden md:flex'>
{!user ? (
            <>
              <Link href="/login" className="text-gray-700 hover:text-gray-900">
                Login
              </Link>
              <Link href="/register" className="text-gray-700 hover:text-gray-900">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link href="/profile" className="text-gray-700 hover:text-gray-900">
                Profile
              </Link>
              <button
                onClick={logout}
                className="text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
            </>
          )}
</div>

<button onClick={()=>setIsOpen(!isOpen)} className='md:hidden '>
{isOpen ? <IoClose size={30} /> : <IoMenu size={30} />}</button>

{
    isOpen && (
        <div className="md:hidden  absolute top-full left-0 w-full bg-gray-200 p-4 space-y-4 shadow-md transition-all duration-300 flex justify-center items-center flex-col">
       
       
       {!user ? (
              <>
                <Link
                  href="/login"
                  className="block text-gray-700 hover:text-gray-900"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block text-gray-700 hover:text-gray-900"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/profile"
                  className="block text-gray-700 hover:text-gray-900"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="block text-gray-700 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            )}




        
      </div>
    )
}


</nav>

    </header>
  )
}

export default Navbar
