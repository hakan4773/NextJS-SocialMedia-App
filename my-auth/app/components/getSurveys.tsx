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
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="  space-y-3">
  
              
      {surveys.length === 0 ? (
        <p>Henüz aktif anket yok.</p>
      ) : (
        <div className="space-y-4">   
       
          {surveys.map((survey,index) => {
            const hasVoted = survey.choices.some(choice =>
              choice.voters.includes(user?.id || "")
            );
            return (
            <div
              key={survey._id}
              className="border rounded-md p-4 border-gray-200 bg-white shadow-sm"
            ><div className="relative flex justify-end items-end ">
                <button
                  onClick={() => handleSettingsToggle(index)}
                  className="absolute top-0 right-0 cursor-pointer"
                >
                  <PiDotsThreeBold size={25} />
                </button>
      
                {openSettingIndex === index && (
                  <div className="absolute right-0 top-2 mt-2 p-2 w-64 font-semibold bg-white rounded-lg shadow-lg z-50">
                    <div className="max-h-96 overflow-y-auto">
                      <p className="relative p-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-4">
                        <MdDeleteOutline className="text-red-500" size={25} />
                        <span>Sil</span>
                      </p>
                      <p className="relative p-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-4">
                        <CiEdit size={25} />
                        <span>Düzenle</span>
                      </p>
                      <p className="relative p-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-4">
                        <TiPinOutline size={25} />
                        <span>Profile Sabitle</span>
                      </p>
                      <p className="relative p-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-4">
                        <IoStatsChartOutline size={25} />
                        <span>Post istatistiklerini görüntüle</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
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
              <h2 className="pt-4 ml-2">{survey.question} </h2>
              <ul className="mt-2 space-y-2 ">
                
                {survey.choices.map((choice,index) => {
          const isUserVote = choice.voters.includes(user?.id || "");

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
            </div>
         ) })}
        </div>
      )}
    </div>
  );
}

export default getSurveys;
