"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FollowingProps } from "../types/user";

const Followers = ({
  isFollowersOpen,
  setIsFollowersOpen,
}: {
  isFollowersOpen: boolean;
  setIsFollowersOpen: (open: boolean) => void;
}) => {
  const { user } = useAuth();
  const [followers, setFollowers] = useState<FollowingProps[]>([]);
 
  useEffect(() => {
    const fetchFollow = async () => {
      const response = await fetch("/api/users/followers", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setFollowers(data?.followers);
      }
    };
    fetchFollow();
  }, []);

const handleFollow=async(userId:string)=>{
  const token = localStorage.getItem("token");
  const response = await fetch("/api/users/followers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ followingId: userId
     }),
  });
  const data = await response.json();
  if (response.ok) {
toast.success(data.message);
   /* Takip işlemini anlık güncelle */
    setFollowers(followers.map(f => (
     f._id === userId
     ? {
     ...f,
     followers:user?.id && f.followers.includes(user?.id) 
       ? f.followers.filter(id => id !== user.id) 
       : user ? [...f.followers, user.id] : f.followers
    }:f )));


   }
   else {
    toast.error(data.message);
   }
}


  if (!isFollowersOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 ">
      <div className="bg-white p-4 rounded-lg shadow-lg w-96 transform transition-all duration-300 ease-in-out hover:scale-105  ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Followers</h2>
          <button
            className="text-gray-600 hover:text-red-600 cursor-pointer transition-colors duration-200"
            onClick={() => setIsFollowersOpen(false)}
          >
            <svg
              xmlns="http:www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {followers.map((follow, index) => (
            <div
              key={index}
              className="m-2 flex  p-3 justify-between transition-colors duration-200 hover:bg-gray-100"
            >
              <Link href={`/users/${follow._id}`} className="flex">
                <img
                  src={follow.profileImage}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full border-2 border-gray-200  object-cover"
                />
                <div className="p-2 flex-1" key={index}>
                  <p className="font-bold text-gray-800">{follow.name}</p>
                  <p className="text-sm text-gray-500">{follow.bio}</p>
                </div>
              </Link>

              <div className="p-2 mt-2">
                <button onClick={()=>handleFollow(follow._id)} className="border border-gray-300 px-4 py-1 text-sm rounded-full p-2 hover:bg-slate-200 cursor-pointer">
                  {user?.id && follow.followers.includes(user.id)
                    ? "Unfollow"
                    : "Follow"}
                </button>
              </div>
            </div>
          ))}
        </div>{" "}
      </div>
    </div>
  );
};

export default Followers;
