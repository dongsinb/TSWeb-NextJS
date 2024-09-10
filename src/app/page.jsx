"use client";
import AFC from "../components/projects/AFC/home/home";
import HeaderTS from "../components/header/header";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      //localStorage.removeItem("orderData"); // Remove a specific item
      localStorage.clear(); // Clear all localStorage items if needed
    }
  }, []); // Empty dependency array ensures this runs only once on mount
  return (
    <main>
      <div className="content">
        <HeaderTS user="guest"></HeaderTS>
        <AFC></AFC>
      </div>
    </main>
  );
}
