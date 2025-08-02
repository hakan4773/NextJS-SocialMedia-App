"use client";
import Navbar from "./components/Navbar";
import AuthProvider from "./context/AuthContext";
import "./globals.css";
import {ToastContainer } from "react-toastify";
import Loading from "./loading";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const pathname = usePathname();

   const noNavbarPaths = ["/login", "/register"];
   const showNavbar = !noNavbarPaths.includes(pathname);

  return (
    <html lang="en">
      <body>
      
         <AuthProvider> 
      <Suspense fallback={<Loading />}>
          
     {showNavbar && <Navbar />}
        <ToastContainer  position="top-right"  />
        {children}
      </Suspense>

         </AuthProvider>
       
      </body>
    </html>
  );
}
