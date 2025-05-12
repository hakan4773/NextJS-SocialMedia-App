"use client"
import React, { useEffect, useState } from 'react'
import { CiEdit } from 'react-icons/ci'
import { IoStatsChartOutline } from 'react-icons/io5'
import { MdDeleteOutline } from 'react-icons/md'
import { PiDotsThreeBold } from 'react-icons/pi'
import { TiPinOutline } from 'react-icons/ti'
import { toast } from 'react-toastify'

interface SettingsProps {
  index:{ index: string | number} ;
  isOwner: boolean; 
}

function Settings({ index:{index}, isOwner }: SettingsProps) {
    const [openSettingIndex, setOpenSettingIndex] = useState<number | string |null>(null);
  //Menüyü açma işlevi için tıklama olayını dinleme
    const handleSettingsToggle = (index: string | number) => {
      setOpenSettingIndex(openSettingIndex === index ? null: index)
    };

//Menüyü kapatma işlevi için dışarı tıklama olayını dinleme
      useEffect(() => {
          const handleOutsideClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.settings-button') && !target.closest('.settings-menu')) {
          setOpenSettingIndex(null);
        }
      };
      document.addEventListener('mousedown', handleOutsideClick);
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    },[] )
//post silme işlevi
    const handleRemove=async(postId:string |number)=>{
      const confirmDelete = window.confirm("Bu postu silmek istediğinize emin misiniz?");
      if (!confirmDelete) {
        return;
      }
      const token=localStorage.getItem("token");
      if(!token){
        return
      }
      const res=await fetch("/api/posts",{
       method:"DELETE",
       headers:{
        "Authorization":`Bearer ${token}`
       }, 
       body:JSON.stringify({postId:postId})
      })
      if(res.ok){
        toast.success("Post başarıyla silindi");
      }
      else {
        toast.success("Post  silinemedi")

      }
      
    }
    
      
      const ownerOptions = [
        { icon: <MdDeleteOutline className="text-red-500" />, text: "Sil" },
        { icon: <CiEdit />, text: "Düzenle" },
        { icon: <TiPinOutline />, text: "Profile Sabitle" },
        { icon: <IoStatsChartOutline />, text: "İstatistikler" },
      ];
    
      const otherUserOptions = [
        { icon: <MdDeleteOutline />, text: "Paylaşımı gizle" },
        { icon: <TiPinOutline />, text: "Kullanıcıyı engelle" },
        { icon: <IoStatsChartOutline />, text: "Şikayet et" },
      ];
      const options = isOwner ? ownerOptions : otherUserOptions;



  return (
   
       <div className="relative " >
                    <button
                      onClick={() => handleSettingsToggle(index)}
                      className="p-1 rounded-full hover:bg-gray-100 text-gray-500 settings-button"
                    >
                      <PiDotsThreeBold size={20} />
                    </button>

                    {openSettingIndex === index && ( 
                    <div className="absolute right-0 top-8 mt-1 w-48 bg-white rounded-md shadow-xl z-50 border border-gray-100 settings-menu"   >
                    {options.map((item, i) => (
                      <button
                        key={i}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                     onClick={()=>{
                       if (item.text === "Sil") {
                       handleRemove(index); 
      }
                     }}
                     >
                        <span>{item.icon}</span>
                        <span>{item.text}</span>
                      </button>
                    ))}
                  </div>
                    )}
                  </div>

  )
}

export default Settings
