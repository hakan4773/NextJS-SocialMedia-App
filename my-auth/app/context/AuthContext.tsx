"use client";
import { useRouter } from "next/navigation";
import { useContext, createContext, useState, ReactNode, useEffect } from "react";
import { UserType } from "../types/user";
interface AuthContextType {
    user: UserType | null;
    login: (userData: UserType) => void;
    logout: () => void;
    loading: boolean;
    setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const router=useRouter();
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const token = localStorage.getItem("token");
      
        if (token) {
          fetch("/api/protected", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.user) {
                setUser(data.user);
              } else {
                localStorage.removeItem("token");
                setUser(null);
              }
            })
          .catch((err) => {
        console.error("Fetch error:", err);
        setUser(null);
      })
      .finally(() => {
        setLoading(false); 
      });
        } else {
          setUser(null);
        }
      }, []);
      
    const login = (userData:UserType) => {
        setUser(userData);
    };
    if (user === undefined) {
      return <p>Yükleniyor...</p>; 
    }
    const logout = async() => {
      try {
        await fetch("/api/logout", { method: "POST" }); 
        localStorage.removeItem("token");
        setUser(null); 
        router.push("/login"); 
      } catch (error) {
        console.error("Logout error:", error);
      }
    };

    return (
        <AuthContext.Provider value={{ user ,login, logout,loading,setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};