
import Navbar from "./components/Navbar";
import AuthProvider from "./context/AuthContext";
import "./globals.css";


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
        {children} 
         </AuthProvider>
      </body>
    
    </html>
  );
}
