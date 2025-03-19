"use client"
import React from 'react'
import { ThreeDot } from 'react-loading-indicators'
import { useAuth } from './context/AuthContext'

function loading() {
const {loading}=useAuth();
  return (  
    <div className="flex justify-center items-center h-screen">
      {loading && (
  <ThreeDot variant="bounce" color="#32cd32" size="medium" text="" textColor="" />
  )}
  </div>
  )
}

export default loading
