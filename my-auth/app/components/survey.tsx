"use client"
import React, { useEffect, useState } from 'react'
import { IoAdd } from 'react-icons/io5'

function Survey({isSurveyOpen,setIsSurveyOpen,setPreview,setSelectedImage}:any) {
  const [choices, setChoices] = useState(["Seçenek 1", "Seçenek 2"]);
  const [choicesInput,setChoicesInput] = useState<string[]>([]);
  const [question,setQuestion]=useState<string>("");
  const [duration, setDuration] = useState({ days: 0, hours: 0, minutes: 0 });
  
  const addNewChoice = () => {
    setChoices([...choices, `Seçenek ${choices.length + 1}`]);
  };
  const handleChoiceChange=(id:number,value:string)=>{
    const options=[...choicesInput];
    options[id]=value;
    setChoicesInput(options); 
  }
{
}
useEffect(()=>{
  setPreview(null);
  setSelectedImage(null);
}, [])

const handleSubmit =async(e: React.MouseEvent<HTMLButtonElement>)=>{
e.preventDefault();
  const token = localStorage.getItem("token");
  const finalChoices = choicesInput.map((c, i) => c || choices[i]);

    try {
      const res = await fetch("/api/surveys", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body:JSON.stringify({
          question,
          choices: finalChoices,
          duration,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Anket başarıyla oluşturuldu");
        setIsSurveyOpen(false); 
        setQuestion(""); 
        setChoices(["Seçenek 1", "Seçenek 2"]);
        setChoicesInput([]);
        setDuration({ days: 0, hours: 0, minutes: 0 });
      } else {
        alert(data.message || "Anket oluşturulurken bir hata oluştu");
            }
    } catch (error) {
      alert("Bir hata oluştu, lütfen tekrar deneyin"); 
  };

}

  return (
      <div >
       <div className='flex  flex-col space-y-3 '>
        {/* Soru Alanı */}
        <input className="p-2 text-xl w-full mb-2  " 
         value={question} onChange={(e)=>setQuestion(e.target.value)} type="text" placeholder= "Soru sorun..."></input>  
 
        <div className='border rounded-md border-gray-300'>   
            {/* Seçenekler */}
    {choices.map((choice, index) => (
          <div key={index} className="p-2 flex space-x-2 items-center ">
            <input
              className="border rounded-md border-gray-300 p-2 w-full"
              type="text"
              value={choicesInput[index] || ""}
  onChange={(e)=>handleChoiceChange(index,e.target.value)}
              placeholder={choice}
            />
            {index === choices.length - 1 && (
              <button className="cursor-pointer" onClick={addNewChoice}>

              {choices.length < 4 && (<IoAdd size={30} className="text-blue-500 hover:bg-blue-200 rounded-full" />
              )}  
              </button>
            )}
          </div>
        ))}
  <div className='border-t w-full border-gray-300 pt-2'>
  <h2 className='p-2 font-medium text-gray-700'>Anket Süresi</h2>
  <div className='flex space-x-2 p-2'>
    {/* Gün */}
    <div className='flex-1'>
      <label className='block text-sm text-gray-500 mb-1'>Gün</label>
      <input 
        type='number'
        min='0'
        max='30'
        placeholder='0'
        value={duration.days}
                  onChange={(e) =>
                    setDuration({ ...duration, days: Number(e.target.value) })
                  }
        className='w-full border rounded-md border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
      />
    </div>
    
    {/* Saat */}
    <div className='flex-1'>
      <label className='block text-sm text-gray-500 mb-1'>Saat</label>
      <input 
        type='number'
        min='0'
        max='23'
        placeholder='0'
        value={duration.hours}
                  onChange={(e) =>
                    setDuration({ ...duration, hours: Number(e.target.value) })
                  }
        className='w-full border rounded-md border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
      />
    </div>
    
    {/* Dakika */}
    <div className='flex-1'>
      <label className='block text-sm text-gray-500 mb-1'>Dakika</label>
      <input 
        type='number'
        min='0'
        max='59'
        placeholder='0'
        value={duration.minutes}
                  onChange={(e) =>
                    setDuration({ ...duration, minutes: Number(e.target.value) })
                  }
        className='w-full border rounded-md border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
      />
    </div>
  </div>
</div>

<div className='border-t w-full border-gray-300 flex bg-blue-500 justify-center items-center p-2  hover:bg-blue-400 '>
  
 <button className=' w-full cursor-pointer text-white' onClick={handleSubmit}
 > Anketi Paylaş</button> 
   </div>
</div>

</div>

       </div>
  )
}

export default Survey
