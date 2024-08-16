"use client";
import React, { useEffect, useState } from "react";
import BagCounting from "../../../components/projects/AFC/bagCounting/bagCounting";
import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";

const CountingAFCPage = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
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
  const router = useRouter();
  const checkErrorBag = () => {
    router.push("/home/countingAFC/orderProcessing");
  };

  return (
    <div>
      <Button onClick={checkErrorBag}>Xử lý đơn hàng</Button>
      <h4 style={{ color: "white" }}>Counting AFC</h4>
      <BagCounting data={data}></BagCounting>
    </div>
  );
};

export default CountingAFCPage;
