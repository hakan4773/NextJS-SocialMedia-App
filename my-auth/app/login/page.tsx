"use client"
import React from 'react'
import AuthForm from '../components/AuthForm'
import { LoginFormData } from '../types/auth';
const handleSubmit = (data: LoginFormData) => {
  console.log("login data:", data);


};
function page() {
  return (
    <div className='mt-16' >
      <AuthForm type="login" onSubmit={handleSubmit} />
    </div>
  )
}

export default page
