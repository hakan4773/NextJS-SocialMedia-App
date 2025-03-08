
import Navbar from "./components/Navbar";
import AuthProvider from "./context/AuthContext";
import "./globals.css";
import { toast, ToastContainer } from "react-toastify";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
      <body>
         <AuthProvider> 
        <Navbar />
        <ToastContainer  position="top-right"  />
        {children} 
         </AuthProvider>
      </body>
    
    </html>
  );
}
