"use client"    
import { useAuth } from '../../context/AuthContext'
import React, {  useState } from 'react'
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import * as z from "zod";
function page() {
  const router=useRouter();
const {user}=useAuth();
const [errors, setErrors] = useState<{ newPassword?: string }>({});

const resetSchema=z.object({
  newPassword:z.string().min(6,"New Password must be at least 6 characters")
})




const [formData,setFormData]=useState({oldPassword: "",
  newPassword: ""});

const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
  const {value,name}=e.target;
  setFormData({...formData,[name]:value})
}

const handleSubmit = async(e: React.FormEvent) => {
  e.preventDefault();

const result =resetSchema.safeParse(formData);
if (!result.success) {
const errorMessages=result.error.format();
setErrors({ newPassword: errorMessages.newPassword?._errors[0] });
return ;
}

try {
  const response=await fetch("/api/profile",{
    method:"PUT",
    headers:{
      "Content-Type":"application/json"
     },
     body:JSON.stringify({ email: user?.email, ...formData })
   })
  
  if(response.ok){
    const data =await response.json();
    toast.success("Profil başarıyla güncellendi");
    setFormData(data);

  }
  else {
    toast.error("Güncelleme başarısız");
  }

} catch (error:any) {
  toast.error("Bir hata oluştu, lütfen tekrar deneyin");
}




};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 relative animate-fade-in">
    <div className="pt-16 w-full max-w-md mx-auto">
      <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-2xl space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-white text-center">Profil Güncelle</h1>
        <div className="flex justify-center">
          <div className="relative">
            <img
              src={"/5.jpg"}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-2 border-white mx-auto mb-4 object-cover"
            />
            <input
              type="file"
              accept="image/*"
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
            className="w-full bg-gradient-to-r cursor-pointer from-blue-500 to-indigo-600 text-white p-2 rounded hover:from-blue-600 hover:to-indigo-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
          Güncelle
          </button>
          <button
            type="button"
            onClick={()=>router.push("/")}
            className="w-full bg-gray-500 cursor-pointer text-white p-2 rounded hover:bg-gray-600 transition-all mt-2"
          >
            Geri Dön
          </button>
        </form>
      </div>
    </div>
  </div>
  )
}

export default page
