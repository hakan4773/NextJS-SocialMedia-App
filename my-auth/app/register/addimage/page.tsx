"use client"
import React, { useState } from 'react'
import { motion } from "motion/react"
import { useRouter } from 'next/navigation';
function page() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file (e.g., JPG, PNG).");
        setSelectedImage(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) { 
        setError("Image size must be less than 5MB.");
        setSelectedImage(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
          setError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (selectedImage) {
  
      router.push("/login");
    } else {
      setError("Please select an image first.");
    }
  };
  return (
    <motion.div 
    initial={{ opacity: 0,y:20 }}
    animate={{ opacity: 1,y:0 }}
    transition={{ duration:0.7 }}
    className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-pink-500 relative py-24">
   
      <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md transform transition-all duration-300 hover:shadow-3xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          Choose Your Profile Picture
        </h1>
        {error && (
          <p className="text-red-500 text-center mb-4 animate-pulse">{error}</p>
        )}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-indigo-500 bg-gray-200">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
          </div>
          <div className="w-full">
            <label className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
              Select Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-indigo-600 hover:to-pink-600 transition-all disabled:opacity-50"
            disabled={!selectedImage}
          >
            Save and Continue
          </button>
          <p className="text-sm text-gray-600 text-center">
            Image should be less than 5MB and in JPG/PNG format.
          </p>
        </div>
      </div>
  


    </motion.div>
  )
}

export default page
