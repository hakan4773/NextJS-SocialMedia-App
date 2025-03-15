

const Following = ({ isFollowingOpen, setIsFollowingOpen }:{isFollowingOpen: boolean;
  setIsFollowingOpen: (open: boolean) => void}) => {
    if (!isFollowingOpen) return null;
  const following=[{name:"Ali Yılmaz",description:"Yazılım geliştiricisi",image:"/5.jpg"},
    {name:"Mehmet yıldız",description:"içerik üreticisi",image:"/orman.jpg"},
    {name:"Ayşe aslan",description:"Blogger",image:"/3.jpg"},
    {name:"Ayşe aslan",description:"Blogger",image:"/3.jpg"},
    {name:"Ayşe aslan",description:"Blogger",image:"/3.jpg"},
 
  ]
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 ">
        <div className="bg-white p-4 rounded-lg shadow-lg w-96 transform transition-all duration-300 ease-in-out hover:scale-105  ">
        <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-gray-800">Following</h2>
      <button
        className="text-gray-600 hover:text-red-600 cursor-pointer transition-colors duration-200"
        onClick={() => setIsFollowingOpen(false)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div className="max-h-96 overflow-y-auto"> 
 {following.map((follow,index)=>( 
<div key={index} className="m-2 flex  p-3 justify-between transition-colors duration-200 hover:bg-gray-100" >
<img
              src={follow.image}
              alt="Avatar"
              className="w-12 h-12 rounded-full border-2 border-gray-200  object-cover"
            /> 
<div className='p-2 flex-1' key={index}>
                <p className='font-bold text-gray-800'>{follow.name}</p>
                <p className="text-sm text-gray-500">{follow.description}</p>
            </div>

     <div className="p-2 mt-2"><button className="border border-gray-300 px-4 py-1 text-sm rounded-full p-2 hover:bg-slate-200 cursor-pointer">Takip ediliyor</button></div>
      
  </div>
  
))} 
       </div> </div>
      </div>
    );
  };
  
  export default Following;
  