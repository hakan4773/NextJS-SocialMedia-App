"use client"  
import Link from 'next/link';
import React from 'react'
import { FcGoogle } from "react-icons/fc";
import { SlSocialFacebook } from "react-icons/sl";
import { GrTwitter } from "react-icons/gr";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LoginFormData, RegisterFormData } from "../types/auth";

const registerSchema=z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
    email:z.string().email("Invalid email address"),
  password:z.string().min(6,"Password must be at least 6 characters")
})
const loginSchema=z.object({
  email:z.string().email("Invalid email address"),  
  password:z.string().min(6,"Password must be at least 6 characters")
})
type FormType = "register" | "login";

interface AuthFormProps{
type:FormType,
onSubmit:(data:RegisterFormData | LoginFormData)=>void
}
function AuthForm({type,onSubmit}:AuthFormProps) {
const {
  register,
  handleSubmit,
  formState:{errors},
}=useForm<RegisterFormData | LoginFormData>({
resolver:zodResolver(type==="register" ? registerSchema:loginSchema)
})
  return (

    <form  onSubmit={handleSubmit(onSubmit)} className='max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded '>
{type === "register" && ( 
   <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            {...register("name")}
            className="w-full p-2 border rounded"
            type="text"
          />
          {/* {errors.name && <p className="text-red-500">{errors.name.message}</p>} */}
        </div>
)}
<div  className='mb-4'>
<label className="block text-gray-700">Email</label>
    <input
      {...register("email")}
     className='w-full rounded border p-2' type='email'> 
    </input>
    {errors.email && <p className='text-red-500'>{errors.email.message}</p>}

</div>


<div  className='mb-4'>
<label className="block text-gray-700">Password</label>
    <input
           {...register("password")}  className='w-full rounded border p-2' type='password'>
    </input>
    {errors.password && <p className='text-red-500'>{errors.password.message}</p>}

</div>

<button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600" >
        {type === "register" ? "Register" : "Login"}
      </button>

      <div className='mt-2 w-full flex flex-col justify-center items-center'>
<p >Ya da </p>
<div>
Zaten bir Hesabınız Varmı
<Link href={type === "register" ? "/login" :"/register"} className='text-blue-600 mx-1 underline'> {type === "register" ? "Login " : "Register"}</Link>
</div>

<div className='flex justify-center items-center mt-4 space-x-4'>
 <Link href={"google"}> <FcGoogle className='text-4xl mt-2 transition-all delay-150 hover:scale-120' /></Link>
<Link href={"facebook"}> <SlSocialFacebook className='text-4xl mt-2 text-blue-600  transition-all delay-150 hover:scale-120' /></Link>
<Link href={"twitter"}> <GrTwitter className='text-4xl mt-2 text-blue-400 transition-all delay-150 hover:scale-120' /></Link>
</div>
</div>
    </form>
  )
}

export default AuthForm
