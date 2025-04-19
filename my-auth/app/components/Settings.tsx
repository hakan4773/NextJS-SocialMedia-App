"use client"
import React, { useState } from 'react'
import { CiEdit } from 'react-icons/ci'
import { IoStatsChartOutline } from 'react-icons/io5'
import { MdDeleteOutline } from 'react-icons/md'
import { PiDotsThreeBold } from 'react-icons/pi'
import { TiPinOutline } from 'react-icons/ti'

interface SettingsProps {
  index: { index: number };
  isOwner: boolean; 
}

function Settings({ index: { index }, isOwner }: SettingsProps) {
    const [openSettingIndex, setOpenSettingIndex] = useState<number | null>(null);

    const handleSettingsToggle = (index: number) => {
        setOpenSettingIndex(openSettingIndex === index ? null : index);
      };
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


      console.log("isOwner?", isOwner);

  return (
   
       <div className="relative ">
                    <button
                      onClick={() => handleSettingsToggle(index)}
                      className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                    >
                      <PiDotsThreeBold size={20} />
                    </button>

                    {openSettingIndex === index && (
                    <div className="absolute right-0 top-8 mt-1 w-48 bg-white rounded-md shadow-xl z-50 border border-gray-100">
                    {options.map((item, i) => (
                      <button
                        key={i}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
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
