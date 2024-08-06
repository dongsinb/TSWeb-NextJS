"use client";
import React, { useEffect, useState } from "react";
import ShowListBetrimex from "../../../components/projects/betrimex/showDataFromDB/showListBetrimex";
import styles from "./collections.module.css";

function CollectionsPage() {
  const [data, setData] = useState([
    {
      address: "",
      coconutType: "",
      quantity: 0,
      lotCode: "",
      phoneNumber: "",
      supplier: "",
      time: "",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:5000/getData");
      const result = await res.json();
      setData(result);
    };

    fetchData();
  }, []);

  console.log("data: ", data);

  return (
    <div>
      <h1 className={styles.label}>Danh sách đơn hàng</h1>
      <ShowListBetrimex data={data} />
    </div>
  );
}

export default CollectionsPage;
