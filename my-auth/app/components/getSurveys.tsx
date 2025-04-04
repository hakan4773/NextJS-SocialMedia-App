"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { format } from "timeago.js";

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
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      
          {surveys.map((survey) => (
            <div
              key={survey._id}
              className="border rounded-md p-4 border-gray-200 bg-white shadow-sm"
            >
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
                {survey.choices.map((choice,index) => (
                  <li
                    key={choice._id}
                    onClick={()=> vote(survey._id,index) }
                    className="flex justify-between items-center border border-blue-500 rounded-full p-2 cursor-pointer hover:bg-blue-100"
                  >
                    <span className="text-blue-600 font-bold">{choice.text}</span>
                    <span className="text-gray-500">
                      ({choice.voters.length} oy)
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-500 mt-2">
          
                Bitiş: {new Date(survey.endDate).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default getSurveys;
