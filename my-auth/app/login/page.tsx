"use client"
import React, { useState } from 'react'
import { motion } from "motion/react"
import AuthForm from '../components/AuthForm'
import { LoginFormData } from '../types/auth';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { ThreeDot } from "react-loading-indicators";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Cookies from "js-cookie"

function page() {
  const router=useRouter();
  const {login}=useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: LoginFormData) => {
    setLoading(true)

    try {
      
  const response =await fetch("/api/login",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(data)
  });
  const result=await response.json();

  if(response.ok){
    Cookies.set("token", result.token, { expires: 1, path: "/" });

    localStorage.setItem("token", result.token);
    
    const verifyResponse = await fetch("/api/protected", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${result.token}`,
      },
    });
    const verifyResult = await verifyResponse.json();

    if (verifyResponse.ok && verifyResult.user) {
      setLoading(false)
      login(verifyResult.user);
      router.push("/");
    } 
  } else {
    toast.error(result.message || "Login failed ❌");
      }
} catch (error) {
  toast.error("An error occurred during login ❌"); 
} finally {
  setLoading(false);
}


};
if(loading){

  return(
    <div className="flex items-center justify-center h-screen">
<ThreeDot variant="bounce" color="#32cd32" size="medium" text="" textColor="" />  </div>
  )
}

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
