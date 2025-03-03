"use client"
import React from 'react'
import AuthForm from '../components/AuthForm'
import { RegisterFormData } from '../types/auth';
function page() {
  const handleSubmit = (data: RegisterFormData) => {
    console.log("Register data:", data);


  };
  return (
    <div className='mt-8' >
     <h1>Register</h1>
     <AuthForm type='register' onSubmit={handleSubmit} />
    </div>
  )
}

export default page
