"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { format } from "timeago.js";
import { useAuth } from "../context/AuthContext";
import Interaction from "../users/components/Interaction";
import { Survey } from "../types/user";
import Settings from "./Settings";
type SurveyProps = {
  userId?: string;
};
function getSurveys({userId}:SurveyProps) {
  const { user } = useAuth();

  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [votedSurveyId, setVotedSurveyId] = useState<string | null>(null); // Oy verilen anketin ID’si
  const [votedChoiceIndex, setVotedChoiceIndex] = useState<number | null>(null); // Oy verilen seçenek index’i




  //Anketleri getirme
  const surveyFetch = async () => {
    const token = localStorage.getItem("token");
    try {
      const url = userId ? `/api/users/${userId}` : "/api/surveys";
      const res = await fetch(url, {
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
  const vote = async (surveyId: string, choiceIndex: number) => {
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
  };

  if (loading) return <div>Yükleniyor...</div>;
  // if (error) return <div className="text-red-500">{error}</div>;

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
                  <div className="flex items-center ">
                    <Image
                                    src={survey.creator.profileImage}
                                    alt="Profile"
                                    width={44}
                                    height={44}
                                    className="rounded-full border-2 border-blue-100"
                                  />
                    <div className="ml-3 ">
                      <h3 className="  text-lg">{survey.creator?.name}</h3>
                      <p className="text-gray-400 text-sm">
                        {format(survey?.createdAt)}
                      </p>
                    </div>
                  </div>

                 <Settings index={{ index }} isOwner={survey.creator._id.toString() === user?._id?.toString()}/>

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
