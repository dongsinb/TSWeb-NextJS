// src/app/api/verifyToken/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request) {
  // Lấy token từ header Authorization (hoặc cookie nếu bạn muốn)
  const authHeader = request.headers.get("Authorization");
  const token =
    authHeader?.split(" ")[1] || request.cookies.get("token")?.value;

  // Kiểm tra xem token có tồn tại không
  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  try {
    // Kiểm tra tính hợp lệ của token
    const decoded = jwt.verify(token, "TS123"); // Thay 'TS123' bằng khóa bí mật của bạn

    // Nếu token hợp lệ, trả về thông tin giải mã của token
    return NextResponse.json({ message: "Token is valid", user: decoded });
  } catch (error) {
    // Nếu token không hợp lệ hoặc hết hạn
    console.log("check token: ", error.name);
    if (error.name === "TokenExpiredError") {
      console.log("Token hết hạn, yêu cầu đăng nhập lại");
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    } else {
      console.log("Token không hợp lệ");
      return NextResponse.json({ message: "Expired token" }, { status: 402 });
    }
    // Nếu token không hợp lệ hoặc hết hạn
  }
}
