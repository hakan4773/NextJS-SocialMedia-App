import { FiBell } from "react-icons/fi";
import { FaArrowTrendUp } from "react-icons/fa6";
import Link from "next/link";
import { PiDotsThreeBold } from "react-icons/pi";
import { useEffect, useState } from "react";
import { Post } from "../types/user";

export default function RightBar() {
    const [openSettingIndex, setOpenSettingIndex] = useState<number | null>(null);
    const [trends, setTrends] = useState<Post[]>([]);
 const toggleSetting=(index:any)=>{
    setOpenSettingIndex(openSettingIndex === index ? null: index)
 }
  const notifications = [
    { id: 1, message: "Ayşe Yılmaz paylaşımını beğendi", time: "10 dk önce" },
    { id: 2, message: "Ali Kaya seni takip etti", time: "1 saat önce" },
    { id: 3, message: "Yeni bir yorum aldın", time: "2 saat önce" },
  ];
useEffect(()=>{

  const fetchTags=async()=>{
    const res=await fetch('/api/posts',{
      method:'GET',
      headers:{
        Authorization:`Bearer ${localStorage.getItem('token')}`,
      },
   } )
    const data=await res.json()
    if(res.ok){
      setTrends(data.posts)
    }else{
      console.error('Tag verisi alınamadı:',data.error)
    }
  }
  fetchTags();
},[])
  
const allTags: string[] = trends.map(trend => trend.tags).flat();
const tagFrequency: { [key: string]: number } = {};
allTags.forEach(tag=>{
  const cleanTag = tag.trim();
tagFrequency[cleanTag]=(tagFrequency[cleanTag] || 0) + 1;
})

  return (
    <div className="space-y-4">
      {/* Bildirimler */}
      <div className="p-4 bg-white  rounded-lg shadow-md">
        <h3 className="text-lg font-semibold  flex items-center">
          <FiBell className="mr-2" /> Son hareketler
        </h3>
        <ul className="mt-2 space-y-2">
          {notifications.map((notification) => (
            <li key={notification.id} className="text-sm">
              {notification.message} • <span className="text-gray-400">{notification.time}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Trendler */}
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold flex"><FaArrowTrendUp  className="mr-2" />Trendler</h3>
        <ul className="mt-2  text-xl">
          {allTags.map(([tag,count],index) => (
            
            <div key={index} className="hover:bg-gray-50 " >
            <div className="relative  flex justify-end items-end ">
                <button onClick={() => toggleSetting(index)} className="cursor-pointer" ><PiDotsThreeBold /></button>

                {openSettingIndex === index && ( <div className="absolute right-0 top-full mt-2 p-2 w-52 text-sm bg-white rounded-lg shadow-lg z-50"> 
                    <div className="max-h-96 overflow-y-auto"> 
                    <p  className="relative p-2 hover:bg-gray-50 cursor-pointer">Bunu önerme</p> 
                    <p  className="relative p-2 hover:bg-gray-50 cursor-pointer">Spam</p> 

                    </div> </div> )}
            </div>

            <li className="text-blue-400 text-sm  p-2 flex justify-between ">
            <Link href={`/tag/${tag.replace("#", "")}`}>
  {tag} <span className="text-gray-400 ml-1">• {count} paylaşım</span>
</Link>

            {/* <p className="text-gray-400">{trend.categories}</p> */}
            </li>
            
            </div>
          ))}
{/* Yükleme */}
          <div className="flex justify-center text-sm p-2  hover:bg-slate-200 "><button className="cursor-pointer">Daha Fazla Göster</button></div>
        </ul>
      </div>
    </div>
  );
}