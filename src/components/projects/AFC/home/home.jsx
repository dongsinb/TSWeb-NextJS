"use client";
import React, { useEffect, useState } from "react";
import BagCounting from "../bagCounting/bagCounting";
import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";

const AFCHome = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    console.log("test counting");
    const storedData = localStorage.getItem("confirmOrder");
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);
  // Log data after it has been set
  useEffect(() => {
    if (data) {
      console.log("received data: ", data);
    }
  }, [data]);
  if (!data) {
    return <div style={{ color: "white" }}>Chưa có đơn hàng được gọi</div>;
  }

  return (
    <div>
      <h4 style={{ color: "white" }}>Counting AFC</h4>
      <BagCounting data={data}></BagCounting>
    </div>
  );
};

export default AFCHome;
