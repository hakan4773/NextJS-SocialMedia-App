"use client";

import React, { useState } from "react";
import { CiHashtag, CiImageOn } from "react-icons/ci";
import { SlCalender } from "react-icons/sl";
import { RiSurveyLine } from "react-icons/ri";
import Modal from "../components/Modal";

function PostCreation() {

const [selectedImage, setSelectedImage] = useState<string | null>(null);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [content,setContent]=useState<string | number | any> ("");


 const handleTag=()=>{

setContent(content +"#")

 }
 const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };


  const handleSelectImage=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files?.[0];
    if(file){
  const imageUrl=URL.createObjectURL(file)
  setSelectedImage(imageUrl);
}
  }


  return (
    <div className="flex w-full bg-white rounded-md shadow-md" >
    {/* resim-avatar */}
  
    <div className="m-2">
    <img
                src={"/5.jpg"}
                alt="Avatar"
                className="w-16 h-16 rounded-full border-2 border-white  object-cover"
              />
           
    </div>
  
    {/* textarea */}
  <div className="w-full p-4">
    <textarea value={content} onChange={(e)=>setContent(e.target.value)} className="border rounded-xl   w-full p-2 h-24" placeholder="Ne paylaşmak istersin?"></textarea>
  
  {/* Butonlar ve araçlar */}  
  <div className="border-t  border-b h-auto p-2  flex flex-row justify-between">
  
    <div className="flex space-x-6" >
  
  <div className="flex">
    <label className="cursor-pointer text-green-500 hover:text-green-700 transition-colors">
    <CiImageOn className="text-blue-500 hover:text-blue-700 " size={30}/>
    <input type="file" 
     onChange={(e:any)=>handleSelectImage(e)}
      className="hidden" 
      accept="image/*"
      ></input>
  </label>
  </div>
  
  {/* Etkinlik oluşturma */}
  <div> 
  <button data-modal-target="crud-modal" className="cursor-pointer"
   onClick={handleOpen} data-modal-toggle="crud-modal" 
    type="button">
  <SlCalender  size={25} className="text-orange-500 hover:text-orange-700"/>
  </button>
  <Modal isOpen={isModalOpen} onClose={handleClose}  />
     </div>
  {/* Anket oluşturma */}
     <div> 
     <RiSurveyLine  size={25} className="text-red-500 hover:text-blue-700"/>
     </div>
     {/* Tag oluşturma */}
     <div> 
      <button className="cursor-pointer" onClick={handleTag}>
        <CiHashtag   size={25} className="text-blue-800 hover:text-blue-900 "/> 
      </button>
    
     </div>
    </div>  
  
  {/*gönderi paylaş butonu */}
  <div className="flex  text-white">
      <button className="p-2 bg-blue-600 rounded-md cursor-pointer hover:bg-blue-300">Paylaş</button>
  </div>
  
  
  
    </div>
    
  </div>
  
    
        </div>
  )
}

export default PostCreation
