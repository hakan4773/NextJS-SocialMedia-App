
import Navbar from "./components/Navbar";
import AuthProvider from "./context/AuthContext";
import "./globals.css";
import {ToastContainer } from "react-toastify";
import Loading from "./loading";
import { Suspense } from "react";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      
      <body>
      <Suspense fallback={<Loading />}>
         <AuthProvider> 
          <Loading />
        <Navbar />
        <ToastContainer  position="top-right"  />
        {children}
         </AuthProvider>
         </Suspense>
      </body>
    
    </html>
  );
}
