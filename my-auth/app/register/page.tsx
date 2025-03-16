"use client"
import React from 'react'
import { motion } from "motion/react"
import AuthForm from '../components/AuthForm'
import { RegisterFormData } from '../types/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
function page() {
  const router=useRouter();
  const handleSubmit =async (data: RegisterFormData) => {
    const response =await fetch("/api/register", {
      method: "POST",
    headers:{
      "content-type":"application/json"
    }
  ,body: JSON.stringify(data)
  })
  const result = await response.json();
  console.log(result);
  if(response.ok){
    router.push("/register/addimage");
  }
  else  {
     toast.error("Kayıt başarısız oldu ❌"); 
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
  

     <AuthForm type='register' onSubmit={handleSubmit} />
    </div>
    </motion.div>
  )
}

export default page
