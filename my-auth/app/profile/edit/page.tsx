"use client"
import { useAuth } from '../../context/AuthContext';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import * as z from "zod";
import { FiArrowLeft } from 'react-icons/fi';

const resetSchema = z.object({
  name: z.string().min(2, "Ad en az 2 karakter olmalı"),
  bio: z.string().max(100, "Bio en fazla 150 karakter olabilir").optional(),
  oldPassword: z.string().optional(),
  newPassword: z.string().optional().refine(val => !val || val.length >= 6, {
    message: "Yeni şifre en az 6 karakter olmalı"
  })
});

function Page() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    profileImage: user?.profileImage,
    oldPassword: "",
    newPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    if (file.size > 2 * 1024 * 1024) { 
      toast.error("Resim boyutu 2MB'den küçük olmalıdır");
      return;
    }
    setSelectedFile(file);
  }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
     setFormData({
        name: data.user.name,
        bio: data.user.bio,
        profileImage: data.user.profileImage,
        oldPassword: "",
        newPassword: "",
      });

      } else {
        console.error("Profil verisi alınamadı:", data.error);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = resetSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.format();
      setErrors({
        name: fieldErrors.name?._errors[0] || "",
        newPassword: fieldErrors.newPassword?._errors[0] || "",
      });
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
      setLoading(false);
      toast.error("Giriş yapmanız gerekiyor.");
      return;
    }
      const fd = new FormData();
      fd.append("name", formData.name);
      if (formData.bio !== user?.bio) fd.append("bio", formData.bio);
      if (formData.newPassword) {
        fd.append("oldPassword", formData.oldPassword);
        fd.append("newPassword", formData.newPassword);
      }

      if (selectedFile) {
        fd.append("profileImage", selectedFile);
      }

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      if (response.ok) {
        const updatedUser = await response.json();
        toast.success("Profil başarıyla güncellendi");

        setUser(updatedUser.user);
        setFormData({
          ...formData,
          oldPassword: "",
          newPassword: "",
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Güncelleme başarısız");
      }
    } 

      catch (err) {
        setLoading(false);
        console.error(err);
        toast.error("Bir hata oluştu, lütfen tekrar deneyin.");
      }
      finally {
  setLoading(false);
}
    };


  return (
    <div className="min-h-screen py-8 flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 relative animate-fade-in">
    <div className="pt-16 w-full max-w-md mx-auto">
      <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-2xl space-y-6 animate-fade-in">
      <button 
              onClick={() => router.back()}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FiArrowLeft size={24} />
            </button>
        <h1 className="text-2xl font-bold text-white text-center">Profil Güncelle</h1>
        <div className="flex justify-center">
          <div className="relative">
            <img
              src={user?.profileImage || "/5.jpg"}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-2 border-white mx-auto mb-4 object-cover"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <button
              className="bg-gray-500 text-white p-1 rounded-full absolute bottom-0 right-0 hover:bg-gray-600 transition-all"
            >
              ✏️
            </button>
       
          </div> 

        </div>
    
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* İsim değiştirme*/}
          <div>
            <label className="block text-gray-100">Adınız ve Soyadınız</label>
            <input
            type='text'
           name='name'
            value={formData.name}
            onChange={handleChange}
            className={`w-full p-2 border rounded 
                 "border-red-500"
               focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/20 text-white placeholder-gray-500`}
            />
            
          </div>
          {/* Bio güncelleme */}
          <div>
            <label className="block text-gray-100">Bio (Hakkında kısmı)</label>
            <input
            type='text'
           name='bio'
            value={formData.bio || ""}
            onChange={handleChange}
              className={`w-full p-2 border rounded 
                 "border-red-500"
               focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/20 text-white placeholder-gray-500`}
            />
            
          </div>

          {/* Şifre değiştirme*/}
          <div>
            <label className="block text-gray-100">Eski Şifre</label>
            <input
            type='password'
            name='oldPassword'
            value={formData.oldPassword || ""}
             onChange={handleChange}
              className={`w-full p-2 border rounded 
                 "border-red-500"
               focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/20 text-white placeholder-gray-500`}
              placeholder="Eski şifrenizi giriniz"
            />
            
          </div>
          <div>
            <label className="block text-gray-100">Yeni Şifre (Opsiyonel)</label>
            <input
            value={formData.newPassword || ""}
            name='newPassword'

             onChange={handleChange}
              type="password"
              className={`w-full p-2 border rounded 
                 "border-red-500"  
               focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/20 text-white placeholder-gray-500`}
              placeholder="Yeni şifre giriniz"
            />
            {errors.newPassword && (
    <p className="text-red-500 text-sm">{errors.newPassword}</p>
  )}
          </div>

    <button
        type="submit"
        disabled={loading}
        className={`w-full bg-gradient-to-r cursor-pointer from-blue-500 to-indigo-600 text-white p-2 rounded
          hover:from-blue-600 hover:to-indigo-700 transition-all
          ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {loading ? "Güncelleniyor..." : "Güncelle"}
      </button>

        
        </form>
      </div>
    </div>
  </div>
  )
}

export default Page
