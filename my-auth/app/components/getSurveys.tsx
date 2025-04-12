"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { format } from "timeago.js";
import { useAuth } from "../context/AuthContext";
import { IoStatsChartOutline } from "react-icons/io5";
import { TiPinOutline } from 'react-icons/ti';

import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { PiDotsThreeBold } from "react-icons/pi";
import { FiBookmark, FiHeart, FiMessageCircle, FiShare } from "react-icons/fi";

interface Choice {
  text: string;
  voters: string[];
  _id: string;
}

interface Survey {
  _id: string;
  question: string;
  choices: Choice[];
  creator:{
    name:string;
    profileImage:string
  }
  endDate: string;
  createdAt: string;
}

function getSurveys() {
  const {user}=useAuth();

  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [votedSurveyId, setVotedSurveyId] = useState<string | null>(null); // Oy verilen anketin ID’si
  const [votedChoiceIndex, setVotedChoiceIndex] = useState<number | null>(null); // Oy verilen seçenek index’i
    const [openSettingIndex, setOpenSettingIndex] = useState<number | null>(null);
    const [comment, setComment] = useState<Record<string, boolean>>({});
  
const handleSettingsToggle=(index:any)=>{
  setOpenSettingIndex(openSettingIndex===index ? null :index)
}

  //Anketleri getirme
 const surveyFetch = async () => {   
   const token = localStorage.getItem("token");
      try {
        const res = await fetch("/api/surveys", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setSurveys(data.surveys);
        } else {
          setError(data.message || "Anketler yüklenemedi");
        }
      } catch (error) {
        setError("Anketleri getirme hatası");
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    surveyFetch();
  }, []);
  const handleComment=(id:number)=>{
    setComment((prev)=>(
{...prev,[id]:!prev[id]}
    ))
  }

  //Post paylaşım metodu
  const handleShare=(id:number,content:string)=>{
    const postUrl=`${window.location.origin}/surveys/${id}`
    
    if(navigator.share){
    navigator.share({
    title:"Paylaşım",
    text:content,
    url:postUrl
    }).catch((error)=>console.error("Paylaşım hatası",error))
    
    }
    else {
      alert("paylaşım desteklenmiyor")
    }
  }
//Anketlere oy verme
const vote=async(surveyId:string,choiceIndex:number)=>{
  const token = localStorage.getItem("token");
  try {
    const res = await fetch("/api/surveys/vote", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ surveyId, choiceIndex }),
    });

    const data = await res.json();
    if (res.ok) {
      setVotedSurveyId(surveyId); 
      setVotedChoiceIndex(choiceIndex); 
      surveyFetch();
    } else {
      alert(data.error || "Oylama başarısız");
    }
  } catch (error) {
    alert("Oy verme sırasında hata oluştu.");
  } 


}
 
  if (loading) return <div>Yükleniyor...</div>;
  // if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div >
  
              
      {surveys.length === 0 ? (
""      ) : (
        <div >   
       
          {surveys.map((survey,index) => {
            const hasVoted = survey.choices.some(choice =>
              choice.voters.includes(user?._id || "")
            );
            return (
            <div
              key={survey._id}
              className="border  p-4 border-gray-200 bg-white  hover:bg-gray-50  cursor-pointer "
            >
              <div className="flex justify-between items-start">
              {/* Üst Bilgi - Kullanıcı Bilgileri */}
                 <div className="flex items-center ">
                <Image
                  src={survey.creator?.profileImage}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="ml-3 ">
                  <h3 className="  text-lg">{survey.creator?.name}</h3>
                  <p className="text-gray-400 text-sm">{format(survey?.createdAt)}</p> 
                </div>
              </div>


              <div className="relative ">
                <button
                  onClick={() => handleSettingsToggle(index)}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-500"                >
                  <PiDotsThreeBold size={20} />
                </button>
      
                {openSettingIndex === index && (
                      <div className="absolute right-0 top-8 mt-1 w-48 bg-white rounded-md shadow-xl z-50 border border-gray-100">
                        {[
                          { icon: <MdDeleteOutline className="text-red-500" />, text: "Sil" },
                          { icon: <CiEdit />, text: "Düzenle" },
                          { icon: <TiPinOutline />, text: "Profile Sabitle" },
                          { icon: <IoStatsChartOutline />, text: "İstatistikler" }
                        ].map((item, i) => (
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
               </div>
              <h2 className="pt-4 ml-2">{survey.question} </h2>
              <ul className="mt-2 space-y-2 ">
                
                {survey.choices.map((choice,index) => {
          const isUserVote = choice.voters.includes(user?._id || "");

                  return (
                  <li
                    key={choice._id}
                    onClick={()=> vote(survey._id,index) }
                    
                    className={`flex justify-between items-center border border-blue-500 rounded-full p-2 cursor-pointer  hover:bg-blue-100 transition-all duration-300
                      ${
                        hasVoted
                            ? isUserVote
                              ? " bg-blue-500 cursor-text hover:bg-blue-500"
                              : "bg-white border-0 hover:bg-white  cursor-text "
                            : " "
                        }
                      `}
                  >
                    <span className={`text-blue-600 font-bold  ${
                     isUserVote ?
                         "text-white"
                          : "" }
                        `} >{choice.text}</span>
                    <span className="text-gray-500">
                      ({choice.voters.length} oy)
                    </span>
                  </li>
                )})}
              </ul>
              <p className="text-sm text-gray-500 mt-2">
          
                Bitiş: {new Date(survey.endDate).toLocaleString()}
              </p>
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <div className="flex justify-between px-4">
                            {[
                              { icon: <FiMessageCircle />, count: 0, color: "hover:text-blue-500" },
                              { icon: <FiHeart />, count: 0, color: "hover:text-red-500" },
                              { icon: <FiShare />, count: 0, color: "hover:text-green-500" },
                              { icon: <FiBookmark />, count: 0, color: "hover:text-yellow-500" }
                            ].map((item, i) => (
                              <button
                                key={i}
                                className={`flex items-center space-x-1 text-gray-500 ${item.color} transition-colors`}
                            
                              >
                                <span className="text-lg">{item.icon}</span>
                                {item.count > 0 && <span className="text-xs">{item.count}</span>}
                              </button>
                            ))}
                          </div>
                        </div>
                
                        {/* Yorum Bölümü */}
                        {comment[survey?._id] && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex space-x-2">
                              <input
                                className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                                placeholder="Yorum yaz..."
                              />
                              <button 
                                type="submit" 
                                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors text-sm font-medium"
                              >
                                Gönder
                              </button>
                            </div>
                          </div>
                        )}
            </div>

         ) })}
        </div>
      )}
    </div>
  );
}

export default getSurveys;
