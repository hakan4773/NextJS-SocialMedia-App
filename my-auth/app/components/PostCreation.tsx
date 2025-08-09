"use client";

import React, { useEffect, useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { SlCalender } from "react-icons/sl";
import { RiSurveyLine } from "react-icons/ri";
import Modal from "./ActivityModal";
import { getUserDetails } from "../utils/getUsers";
import { ThreeDot } from "react-loading-indicators";
import { toast } from "react-toastify";
import Survey from "./Survey";
import { UserType } from "../types/user";
function PostCreation() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null); //resim ekleme için
  const [preview, setPreview] = useState<string | null>(null); //resim görüntüleme için
  const [isModalOpen, setIsModalOpen] = useState(false); //Etkinlik modalı için
  const [content, setContent] = useState<string | number | any>("");
  const [userData, setUserData] = useState<UserType | null>(); //Kullanıcı bilgisi için
  const [loading, setLoading] = useState(false);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false); //Anket modalı için
  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setIsSurveyOpen(false);//Açıksa anket modalını kapat
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getUserDetails();
      setUserData(userData.user);
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Lütfen giriş yapın!");
      setLoading(false);
      return;
    }
    if (!content.trim()) {
      alert("Lütfen bir şeyler yazın!");
      setLoading(false);
      return;
    }
    try {
      const extractedTags = content.match(/#\w+/g) || []; //tagleri ayır
      const cleanedContent = content.replace(/#\w+/g, "").trim(); //sil
      const formData = new FormData();
      formData.append("content", cleanedContent);
      formData.append("tags", JSON.stringify(extractedTags));
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await fetch("/api/posts", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = "/";
        setLoading(false);
        toast.success("Gönderi başarıyla paylaşıldı");
      } else {
        console.error("Gönderi paylaşma başarısız:", data.message);
        alert("Gönderi paylaşılırken bir hata oluştu: " + data.message);
      }
    } catch (error) {
      console.error("Gönderi paylaşma hatası:", error);
      alert("Bir hata meydana geldi. Lütfen tekrar dene.");
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDot
          variant="bounce"
          color="#32cd32"
          size="medium"
          text=""
          textColor=""
        />
      </div>
    );
  }

  return (
    <div className="flex w-full bg-white shadow-md">
      {/* resim-avatar */}

      <div className="m-2">
        <img
          src={userData?.profileImage}
          alt="Avatar"
          className="w-14 h-12 rounded-full border-2 border-white  object-cover"
        />
      </div>

      {/* textarea */}
      <div className="w-full p-4 ">
          <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`border rounded-xl border-gray-300  w-full p-2 h-24 ${isSurveyOpen ? "hidden":""}`}
          placeholder="Ne paylaşmak istersin?"
        >

        </textarea>
        {isSurveyOpen && (
           <Survey  setSelectedImage={setSelectedImage} setPreview={setPreview} setIsSurveyOpen={setIsSurveyOpen}/>
        
        )} 

        {/* Butonlar ve araçlar */}
        <div className=" h-auto p-2  flex flex-row justify-between">
          <div className="flex gap-8 ">
            <div className="flex">
              <label className="cursor-pointer text-green-500 hover:text-green-700 transition-colors">
                <CiImageOn
                  className="text-blue-500 hover:text-blue-700 "
                  size={30}
                />
                <input
                  type="file"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleSelectImage(e)
                  }
                  className="hidden"
                  accept="image/*"
                ></input>
              </label>
            </div>

            {/* Etkinlik oluşturma */}
            <div>
              <button
                data-modal-target="crud-modal"
                className="cursor-pointer"
                onClick={handleOpen}
                data-modal-toggle="crud-modal"
                type="button"
              >
                <SlCalender
                  size={25}
                  className="text-orange-500 hover:text-orange-700"
                />
              </button>
              <Modal isOpen={isModalOpen} onClose={handleClose} />
            </div>

            {/* Anket oluşturma */}
            <div>
              <button className="cursor-pointer" onClick={()=>setIsSurveyOpen(!isSurveyOpen)} type="button">
              <RiSurveyLine
                size={25}
                className="text-red-500 hover:text-blue-700"
              /></button>
            </div>
          </div>

          {/*gönderi paylaş butonu */}
          <div className="flex  text-white">
            <button
              disabled={!content.trim()}
              onClick={handleSubmit}
              className={`${
                content
                  ? "p-2 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-300"
                  : "p-2 bg-gray-500 rounded-full  "
              } `}
            >
              Post Yayınla
            </button>
          </div>
          
        </div>{" "}
        {preview && (
          <div className="mt-2">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-32 object-cover rounded-md"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default PostCreation;
