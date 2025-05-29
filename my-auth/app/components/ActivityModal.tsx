"use client";
import React, { useState } from 'react';
import { toast } from 'react-toastify';


function Modal({ isOpen,onClose }:any) {
  if (!isOpen) return null;
  const [activityName, setActivityName] = useState<string>("");
  const [activityType, setActivityType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const handleSubmit =async(e: React.FormEvent)=>{
    e.preventDefault();

  try {
  const token=localStorage.getItem("token");
  if (!selectedDate || !selectedTime) {
    alert("Lütfen tarih ve saat seçin");
    return;
  }
  if (!activityName || !activityType || !description) {
    alert("Lütfen tüm alanları doldurun");
    return;
  }
  if (!token) {
    alert("Lütfen giriş yapın");
    return;
  }
  if (!selectedImage) {
    alert("Lütfen bir resim seçin");
    return;
  }
const formData = new FormData();
const [hours, minutes] = selectedTime.split(":").map(Number);
  const startDate = new Date(selectedDate);
  startDate.setHours(hours);
  startDate.setMinutes(minutes);
  formData.append("activityName", activityName);
  formData.append("activityType", activityType);
  formData.append("description", description);
  formData.append("startDate", startDate.toISOString());
  formData.append("activityDate", selectedTime);
  formData.append("image", selectedImage);
  
const res=await fetch("/api/activity",{
  method:"POST",
  headers:{
    Authorization: `Bearer ${token}`
  },
  body:formData,
});

const data=await res.json();
if(res.ok){
 toast.success("Etkinlik başarıyla oluşturuldu.");
  setActivityName("");
  setActivityType("");
  setDescription("");
  setSelectedDate("");
  setSelectedImage(null);
  onClose();
  }
  else {
    alert(data.message || "Etkinlik oluşturulurken hata oluştu");
  }}
  catch (error) {
    alert("Bir hata oluştu");
  }
}

  return (
    <div id="crud-modal" tabIndex={-1} aria-hidden="true" className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-slate-200 bg-opacity-90 scroll-auto">
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className=" bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Yeni Etkinlik Oluştur
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-900 cursor-pointer">
              ✖
            </button>
          </div>
          <form className="p-4 md:p-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="col-span-2">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Etkinlik Adı</label>
                <input type="text"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Etkinlik Adı" />
              </div>
              <div className="md:col-span-2 sm:col-span-1">
                <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tarih</label>
                <input type="date" 
                value={selectedDate}
                onChange={(e)=>setSelectedDate(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
             
              </div>
              
              <div className="md:col-span-2 sm:col-span-1">
                <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Saat</label>
                <input type="time" 
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
             
              </div>
           
              <div className="col-span-2 ">
                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Etkinlik Türü</label>
                <select id="category" 
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500  w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                  <option value="">Tür seçin</option>
                  <option value="Online">Online</option>
                  <option value="Yüz Yüze">Yüz Yüze</option>
                </select>
              </div>
                 
              <div className="col-span-2">
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Açıklama</label>  
                <textarea id="description" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Örn: konular, program vb."></textarea>
              </div>
            </div>
            <div className='flex justify-between items-center '>
               <input type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setSelectedImage(file)
                      ;};
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-52 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500  p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                ></input>
            <button type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
             Yeni Etkinlik Oluştur
            </button>
           
              </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Modal;