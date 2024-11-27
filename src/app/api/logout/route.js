// src/app/api/logout/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  // Xóa cookie chứa token
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Xóa cookie 'token' khi người dùng logout
  response.cookies.delete("token", { path: "/" });

  return response;
}
