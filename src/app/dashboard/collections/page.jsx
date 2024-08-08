"use client";
import React, { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import Pagination from "./../../../components/pagination/pagination";
import ShowListBetrimex from "../../../components/projects/betrimex/showDataFromDB/showListBetrimex";
import styles from "./collections.module.css";

function CollectionsPage() {
  const [q, setQuery] = useState({});
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
      const res = await fetch("http://localhost:5000/getData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(q),
      });
      const result = await res.json();
      setData(result);
    };
    fetchData();
  }, [q]);

  const handleSearch = (e) => {
    if (e.target.value) {
      setQuery({ supplier: e.target.value });
    } else {
      setQuery({});
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <h1 className={styles.label}>Danh sách đơn hàng</h1>
        <div className={styles.search}>
          <MdSearch className={styles.iconSearch} />
          <input
            type="text"
            placeholder={"Search order ..."}
            className={styles.input}
            onChange={handleSearch}
          />
        </div>
      </div>
      <ShowListBetrimex data={data} />
      <Pagination />
    </div>
  );
}

export default CollectionsPage;
