"use client";
import { FiBell } from "react-icons/fi";
import Trends from "./Trends";
import { NotificationType } from "../types/user";
import { useEffect, useState } from "react";
import { format } from "timeago.js";

export default function RightBar() {
  const [notifications, setNotifications] = useState<NotificationType[]>([])

useEffect(()=>{
const fetchNotifications = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch('/api/profile',{
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }
    const data = await response.json();
    setNotifications(data.notifications || []);
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
}
fetchNotifications();

},[])

  return (
    <div className="space-y-4">
      {/* Bildirimler */}
      <div className="p-4 bg-white  rounded-lg shadow-md">
        <h3 className="text-lg font-semibold  flex items-center">
          <FiBell className="mr-2" /> Son hareketler
        </h3>
        <ul className="mt-2 space-y-2">
          {notifications.slice(0,3).map((notification,index) => (
            <li key={index} className="text-sm">
              {notification.message} • <span className="text-gray-400">{format(notification.createdAt)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Trendler */}
  <Trends />
    </div>
  );
}