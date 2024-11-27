// src/app/api/login/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const users = [{ id: 1, username: "1", password: bcrypt.hashSync("2", 10) }];

export async function POST(request) {
  const { username, password } = await request.json();
  const user = users.find((u) => u.username === username);

  if (!user) {
    return NextResponse.json({ message: "User is incorrect" }, { status: 401 });
  }

  const isValidPassword = bcrypt.compareSync(password, user.password);
  if (!isValidPassword) {
    return NextResponse.json(
      { message: "Password is incorrect" },
      { status: 401 }
    );
  }

  const token = jwt.sign({ id: user.id, username: user.username }, "TS123", {
    expiresIn: "10h",
  });

  const response = NextResponse.json({ message: "Login successful" });
  response.cookies.set("token", String(token), {
    httpOnly: true,
    path: "/",
    maxAge: 36000,
  });

  // Kiểm tra xem cookie token có được thiết lập hay không
  console.log("Cookie token:", response.cookies.get("token"));

  return response;
}
