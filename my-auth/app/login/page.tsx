"use client"
import React, { useState } from 'react'
import { motion } from 'framer-motion';
import AuthForm from '../components/AuthForm'
import { LoginFormData } from '../types/auth';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Cookies from "js-cookie"

function Page() {
  const router=useRouter();
  const {login}=useAuth();
  const [loading, setLoading] = useState(false);

const handleSubmit = async (data: LoginFormData) => {
  setLoading(true);
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      Cookies.set("token", result.token, { expires: 1, path: "/" });
      localStorage.setItem("token", result.token);

      if (result.user) {
        login(result.user);
        router.push("/");
      } else {
        toast.error("User data missing from response");
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


 if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (

    <motion.div
    initial={{ opacity: 0,y:20 }}
    animate={{ opacity: 1,y:0 }}
    transition={{ duration:0.7 }}
    className="min-h-screen flex  items-center justify-center bg-gradient-to-r from-indigo-500 to-pink-500 relative">
   
    <div className="pt-6 w-full text-center "> 
       <h1 className='text-3xl'>Login</h1>
           <AuthForm type="login" loading={loading} onSubmit={handleSubmit} />
    </div>
    </motion.div>
  )
}

export default Page
