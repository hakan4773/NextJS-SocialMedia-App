import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

interface DecodedToken {
  _id: string;
  iat: number;
  exp: number;
}

export function verifyToken(req: NextRequest): DecodedToken | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return null; 
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    return decoded;
  } catch (error) {
    return null; 
  }
}
