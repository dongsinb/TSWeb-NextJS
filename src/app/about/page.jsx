"use client";
import React from "react";
import ShowListBetrimex from "@/components/projects/betrimex/showDataFromDB/showListBetrimex";
import styles from "./about.module.css";

function AboutPage() {
  console.log("Logging data now...");
  const data = [
    {
      address: "Bình Dương",
      coconutType: "Loại 1",
      quantity: 10,
      lotCode: "D10",
      phoneNumber: "0123456789",
      supplier: "Betrimex",
      time: "11:39:21 1/8/2024",
    },
    {
      address: "Đồng Nai",
      coconutType: "Loại 2",
      quantity: 90,
      lotCode: "D90",
      phoneNumber: "012345999999",
      supplier: "Olam",
      time: "11:43:21 1/8/2024",
    },
  ];
  console.log("data: ", data);

  return (
    <div>
      <h1 className={styles.label}>Danh sách đơn hàng</h1>
      <ShowListBetrimex data={data} />
    </div>
  );
}

export default AboutPage;
