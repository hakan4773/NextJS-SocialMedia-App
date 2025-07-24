"use client"
import React, { useState } from 'react'
import { motion } from 'framer-motion';
import AuthForm from '../components/AuthForm'
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface RegisterTypes{
  userId?:string;
  name?: string;
  email: string;
  password: string;
}
function page() {
  const router=useRouter();
  const [loading,setLoading]=useState(false);
  const handleSubmit =async (data: RegisterTypes) => {
    setLoading(true);
    const response =await fetch("/api/register", {
      method: "POST",
    headers:{
      "content-type":"application/json"
    }
  ,body: JSON.stringify(data)
  })
  const result = await response.json();
  if(response.ok){
    if (result.userId) {
      localStorage.setItem("userId", result.userId); 
      router.push("/register/addimage");
    } else {
      console.error("User ID is undefined");
    }
    setLoading(false);
  }
  else  {
     toast.error("Kayıt başarısız oldu ❌"); 
     setLoading(false)
  }

  };
  return (
    <motion.div 
    initial={{ opacity: 0,y:20 }}
    animate={{ opacity: 1,y:0 }}
    transition={{ duration:0.7 }}
    className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-pink-500 relative ">
       <div className="pt-14 w-full text-center">
       <h1 className='text-4xl'>Register</h1>
  

     <AuthForm type='register' loading={loading} onSubmit={handleSubmit} />
    </div>
    </motion.div>
  )
}

export default page
