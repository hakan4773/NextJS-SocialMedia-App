import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export  function middleware(req:NextRequest){
 const token = localStorage.getItem("token")
    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      
try {
      jwt.verify(token,process.env.JWT_SECRET!);
      return NextResponse.next();
} catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));

}
}
export const config = {
    matcher: ["/profile/:path*"],
  };