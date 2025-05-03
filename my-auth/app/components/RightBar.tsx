import { FiBell } from "react-icons/fi";
import { FaArrowTrendUp } from "react-icons/fa6";
import Link from "next/link";
import { PiDotsThreeBold } from "react-icons/pi";
import { useEffect, useState } from "react";
import { Post } from "../types/user";
import Trends from "./Trends";

export default function RightBar() {
  const notifications = [
    { id: 1, message: "Ayşe Yılmaz paylaşımını beğendi", time: "10 dk önce" },
    { id: 2, message: "Ali Kaya seni takip etti", time: "1 saat önce" },
    { id: 3, message: "Yeni bir yorum aldın", time: "2 saat önce" },
  ];

  return (
    <div className="space-y-4">
      {/* Bildirimler */}
      <div className="p-4 bg-white  rounded-lg shadow-md">
        <h3 className="text-lg font-semibold  flex items-center">
          <FiBell className="mr-2" /> Son hareketler
        </h3>
        <ul className="mt-2 space-y-2">
          {notifications.map((notification) => (
            <li key={notification.id} className="text-sm">
              {notification.message} • <span className="text-gray-400">{notification.time}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Trendler */}
  <Trends />
    </div>
  );
}