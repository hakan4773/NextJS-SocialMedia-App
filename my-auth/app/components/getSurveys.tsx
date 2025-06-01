"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { format } from "timeago.js";
import { useAuth } from "../context/AuthContext";
import Interaction from "../users/components/Interaction";
import { Survey } from "../types/user";
import Settings from "./Settings";
import Link from "next/link";
type SurveyProps = {
  item: Survey;
};
function getSurveys({item}:SurveyProps) {
  const { user } = useAuth();
  const [surveys, setSurveys] = useState<Survey[]>(item ? [item] : []); 

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [votedSurveyId, setVotedSurveyId] = useState<string | null>(null); // Oy verilen anketin ID’si
  const [votedChoiceIndex, setVotedChoiceIndex] = useState<number | null>(null); // Oy verilen seçenek index’i


  //Anketlere oy verme
const vote = async (surveyId: string, choiceIndex: number) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("/api/surveys/vote", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ surveyId, choiceIndex }),
    });

    const data = await res.json();

    if (res.ok) {
      setSurveys((prevSurveys) =>
        prevSurveys.map((survey) => {
          if (survey._id === surveyId) {
            // Kullanıcının ID'sini oy verdiği seçeneğe ekliyoruz
            const updatedChoices = survey.choices.map((choice, index) => {
              if (index === choiceIndex) {
                return {
                  ...choice,
                  voters: [...choice.voters, user?._id || ""],
                };
              }
              return choice;
            });

            return {
              ...survey,
              choices: updatedChoices,
            };
          }
          return survey;
        })
      );
    } else {
      alert(data.error || "Oylama başarısız");
    }
  } catch (error) {
    alert("Oy verme sırasında hata oluştu.");
  }
};


  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div>
      {surveys.length === 0 ? (
        ""
      ) : (
        <div>
          {surveys.map((survey, index:number) => {
            const hasVoted = survey.choices.some((choice) =>
              choice.voters.includes(user?._id || "")
            );
            return (
              <div
                key={survey._id}
                className="border  p-4 border-gray-200 bg-white  hover:bg-gray-50  cursor-pointer "
              >

                <div className="flex justify-between items-start">
                  {/* Üst Bilgi - Kullanıcı Bilgileri */}
                             <Link href={`/users/${item.creator._id}`}>
                  
                  <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Image
                                    src={survey.creator.profileImage}
                                    alt="Profile"
                                    width={44}
                                    height={44}
                                    className="rounded-full border-2 border-blue-100 w-11 h-11 object-cover"
                                  /> </div >
                    <div>



                                 <div className="flex items-center space-x-2">
                                   <h3 className="font-semibold text-gray-800">{survey.creator.name}</h3>
                                   {Array.isArray(user?.followers) && user.followers.includes(survey.creator._id) ? <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Takip Ediyor</span> : ""}
                                   </div>
                                 <div className="flex items-center space-x-2 text-xs text-gray-500">
                                   <span>{"@"+survey.creator.email.split('@')[0]}</span>
                                   <span>•</span>
                                   <span>{format(survey?.createdAt)}</span>
                                 </div>
                               </div>
                  </div>
  </Link>

                 <Settings postId={survey._id} type="survey" isOwner={survey.creator._id.toString() === user?._id?.toString()}/>

                </div>
                <h2 className="pt-4 ml-2">{survey.question} </h2>
                <ul className="mt-2 space-y-2 ">
                  {survey.choices.map((choice, index) => {
                    const isUserVote = choice.voters.includes(user?._id || "");

                    return (
                      <li
                        key={choice._id}
                        onClick={() => vote(survey._id, index)}
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
                        <span
                          className={`text-blue-600 font-bold  ${
                            isUserVote ? "text-white" : ""
                          }
                        `}
                        >
                          {choice.text}
                        </span>
                        <span className="text-gray-500">
                          ({choice.voters.length} oy)
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <p className="text-sm text-gray-500 mt-2">
                  Bitiş: {new Date(survey.endDate).toLocaleString()}
                </p>
                <Interaction item={survey} type="survey" />{" "}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default getSurveys;
