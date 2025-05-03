import { FiBell } from "react-icons/fi";
import { FaArrowTrendUp } from "react-icons/fa6";
import Link from "next/link";
import { PiDotsThreeBold } from "react-icons/pi";
import { useEffect, useState } from "react";
import { Post } from "../types/user";
function Trends() {
    const [openSettingIndex, setOpenSettingIndex] = useState<number | null>(null);
    const [trends, setTrends] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
 const toggleSetting=(index:any)=>{
    setOpenSettingIndex(openSettingIndex === index ? null: index)
 }
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
        setLoading(false);
      }else{
        console.error('Tag verisi alınamadı:',data.error)
      }
    }
    fetchTags();
  },[])
  const allTags: string[] = trends.map((trend) => trend.tags).flat();
    const tagFrequency: { [key: string]: number } = {};
    allTags.forEach((tag) => {
      const cleanTag = tag.trim().toLowerCase();
      tagFrequency[cleanTag] = (tagFrequency[cleanTag] || 0) + 1;
    });
    const sortedTags = Object.entries(tagFrequency).sort((a, b) => b[1] - a[1]);

    if (loading) {
        return <div className="p-4 bg-white rounded-lg shadow-md h-full">Yükleniyor...</div>;
    }


  return (

      <div className="p-4 bg-white rounded-lg shadow-md h-full"> 

        <h3 className="text-lg font-semibold flex"><FaArrowTrendUp  className="mr-2" />Trendler</h3>
        <ul className="mt-2  text-xl">
          {sortedTags.slice(0,3).map(([tag,count],index) => (
            
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
  {tag} <span  className="text-gray-400 ml-1">• {count} paylaşım</span>
</Link>

            {/* <p className="text-gray-400">{trend.categories}</p> */}
            </li>
            
            </div>
          ))}
{/* Yükleme */}
          <div className="flex justify-center text-sm p-2  hover:bg-slate-200 ">
            <Link href={"/tweets"} className="cursor-pointer">Daha Fazla Göster</Link></div>
        </ul>
      </div>
  )
}

export default Trends
