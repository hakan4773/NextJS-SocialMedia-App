"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoClose, IoMenu } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import ResponsiveBar from "./ResponsiveBar";
import FilterUsers from "./FilterUsers";
import { NotificationType, UserType } from "../types/user";
import { format } from "timeago.js";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState<NotificationType[]>([]);
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<UserType[]>([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUser] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchUsers = async () => {
      const token =localStorage.getItem("token");
          setLoading(true);
      try {
         const [res, nfc] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);
      const [data, datanfc] = await Promise.all([res.json(), nfc.json()]);


if (res.ok && nfc.ok){
   setUsers(data.users);
   setNotification(datanfc.notifications);
}
      } catch (error) {
        console.error("Kullanıcılar yüklenirken hata oluştu:", error);
      }
       finally {
      setLoading(false);
    }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredUser([]);
    } else {
      const results = users.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredUser(results);
    }
  }, [search, users]);

  const handleBlur = () => {
  setTimeout(() => {
    setSearch("");
    setFilteredUser([]);
  }, 300);
};



  return (
    <header className="bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md fixed top-0 w-full z-50">
{user && typeof window !== "undefined" && <ResponsiveBar />}

      <nav className="container mx-auto flex justify-between items-center p-4">

        <div className="flex items-center lg:mx-2 mx-12">
          <Link href="/" className="flex items-center ">
            <Image
              src="/PİO2.png"
              alt="Logo"
              className="w-16  h-8 object-cover mt-2 "
              width={512}
              height={512}
            />
            <span className="text-2xl font-bold text-white ">Paylaşio</span>
          </Link>
        </div>

        <div className="hidden md:block flex-1 max-w-md mx-8 relative">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              placeholder="Kullanıcı ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onBlur={handleBlur}
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            {search && <FilterUsers filteredUsers={filteredUsers} />}
          </div>
        </div>

        <div className="flex items-center space-x-4">

        {user && (
  <div className="relative">
    <button
      onClick={() => setOpen((prev) => !prev)}
      className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
    >
      <MdOutlineNotificationsActive size={24} className="text-white" />
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
         {notification.length > 0 ? notification.length : "0"}
      </span>
    </button> 

    {open && (
      <div className="absolute lg:right-0 -right-6 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
             <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800">Bildirimler</h3>
              </div>  
        <div className="max-h-96 overflow-y-auto">
          {notification.length > 0 ? (
            notification.map((notif: NotificationType, i: number) => (
              <div key={i} className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-b-gray-100">
                <p className="text-sm text-gray-800">{notif.message}</p>
                <p className="text-xs text-gray-500 mt-1">{format(notif.createdAt)}</p>
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">
              Bildirimin yok.
            </div>
          )}
        </div>
      </div>
    )}
  </div>
)}




         
          

          {/* Auth Butonları */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="text-white hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Kayıt Ol
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/profile"
                  className="text-white hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  Profilim
                </Link>
                <button
                  onClick={logout}
                  className="text-red-500 hover:text-red-600 px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  Çıkış Yap
                </button>
              </>
            )}
          </div>

          {/* Mobil Menü Butonu */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {isOpen ? (
              <IoClose size={24} className="text-gray-600" />
            ) : (
              <IoMenu size={24} className="text-gray-600" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobil Menü */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 p-4 space-y-4 shadow-lg">
          <div className="flex flex-col space-y-4">
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Kayıt Ol
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/profile"
                  className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Profilim
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="text-red-500 hover:text-red-600 px-4 py-2 rounded-lg hover:bg-gray-100 text-left"
                >
                  Çıkış Yap
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
