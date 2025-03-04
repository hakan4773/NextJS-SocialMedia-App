"use client"
import React from 'react'
import { motion } from "motion/react"
import AuthForm from '../components/AuthForm'
import { LoginFormData } from '../types/auth';
import { useRouter } from 'next/navigation';

function page() {
  const router=useRouter();
  const handleSubmit = async (data: LoginFormData) => {
  const response =await fetch("/api/login",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(data)
  });
  const result=await response.json();
  if(response.ok){
    localStorage.setItem("token",result.token);
  router.push("/");
  }
  else {
     throw new Error(result.message);
  }
  };
  return (

    <motion.div
    initial={{ opacity: 0,y:20 }}
    animate={{ opacity: 1,y:0 }}
    transition={{ duration:0.7 }}
    className="min-h-screen flex  items-center justify-center bg-gradient-to-r from-indigo-500 to-pink-500 relative">
   
    <div className="pt-6 w-full text-center "> 
       <h1 className='text-3xl'>Login</h1>
           <AuthForm type="login" onSubmit={handleSubmit} />
    </div>
    </motion.div>
  )
}

export default page
