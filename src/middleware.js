// src/middleware.js
import { NextResponse } from "next/server";

export async function middleware(request) {
  const url = request.nextUrl;

  if (
    url.pathname.startsWith("/api") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname === "/" ||
    url.pathname.startsWith("/_next/") || // Tài nguyên Next.js
    url.pathname.endsWith(".ico") || // Icon
    url.pathname.endsWith(".png") || // Ảnh PNG
    url.pathname.endsWith(".jpg") || // Ảnh JPG
    url.pathname.endsWith(".jpeg") || // Ảnh JPEG
    url.pathname.endsWith(".mp3") || // Âm thanh MP3
    url.pathname === "/login"
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;

  if (!token) {
    console.log("Không có token, chuyển hướng đến trang đăng nhập");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let isVerified = false;
  console.log("Starting verify");
  console.log("url: ", url.href);

  try {
    if (!isVerified) {
      const verifyResponse = await fetch(
        new URL("/api/verifyToken", request.url),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!verifyResponse.ok) {
        console.log(
          "Token không hợp lệ hoặc hết hạn, chuyển hướng đến trang đăng nhập"
        );
        return NextResponse.redirect(new URL("/login", request.url));
      }

      isVerified = true;
    }

    return NextResponse.next();
  } catch (error) {
    console.log("Lỗi khi gọi API verifyToken:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  // matcher: ['/:path((?!^$|^login$).*)'],
  matcher: "/:path*",
  runtime: "nodejs",
};
