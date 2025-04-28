import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    if (token && (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register"))
        { return NextResponse.redirect(new URL("/", req.url)); 
        }
        if (!token && req.nextUrl.pathname !== "/login" && req.nextUrl.pathname !== "/register") {
            return NextResponse.redirect(new URL("/login", req.url));
        }
         return NextResponse.next(); 
    } 
    export const config =
     {
         matcher: ["/profile/:path*", "/login","/register","/"],
     }