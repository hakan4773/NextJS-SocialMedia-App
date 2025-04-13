"use client";
import React, { useEffect, useState } from "react";
import { Post, Survey, UserType } from "../types/user";

type SavedProps = {
  item: Post | Survey;
  type: "post" | "survey";
};

function Bookmark() {
  const [userData, setUserData] = useState<UserType[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        const res = await fetch("/api/posts/saved", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data=await res.json();
        if (res.ok) {

            setUserData(data.user)
        }
      } catch (error) {
        console.error("bir hata oluştu");
      }
    };
    fetchData();
  }, []);

  return <div>
    Kaydedilenler</div>;
}

export default Bookmark;
