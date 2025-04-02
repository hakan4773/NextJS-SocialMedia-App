"use client"
import React, { useState } from 'react'
import { IoAdd } from 'react-icons/io5'

function Survey({isSurveyOpen,setIsSurveyOpen}:any) {
  const [choices, setChoices] = useState(["Seçenek 1", "Seçenek 2"]);
  const [choicesInput,setChoicesInput] = useState<string[]>([]);
  const addNewChoice = () => {
    setChoices([...choices, `Seçenek ${choices.length + 1}`]);
  };
  const handleChoiceChange=(id:number,value:string)=>{
    const options=[...choicesInput];
    options[id]=value;
    setChoicesInput(options); 
  }

console.log(choicesInput)



  return (
      <div className='border rounded-md border-gray-300 '>
       <div className='flex  flex-col space-y-3 '>
    {choices.map((choice, index) => (
          <div key={index} className="p-2 flex space-x-2 items-center">
            <input
              className="border rounded-md border-gray-300 p-2 w-full"
              type="text"
              value={choicesInput[index]}
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
        className='w-full border rounded-md border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
      />
    </div>
  </div>
</div>

<div className='border-t w-full border-gray-300 flex justify-center items-center p-2  hover:bg-red-100 '>
  
 <button className='text-red-500 w-full cursor-pointer' onClick={()=>setIsSurveyOpen(false)}> Anketi Kaldır</button> 
   </div>
</div>



       </div>
  )
}

export default Survey
