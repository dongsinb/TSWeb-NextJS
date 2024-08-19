"use client";
import React, { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import Pagination from "../../../pagination/pagination";
import ShowListBetrimex from "../showDataFromDB/showListBetrimex";
import styles from "./store.module.css";

const BetrimexStore = () => {
  const [query, setQuery] = useState({});
  const [text, setText] = useState("");
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

  const reloadData = async () => {
    const res = await fetch("http://localhost:5000/getData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
    });
    const result = await res.json();
    setData(result);
  };

  useEffect(() => {
    reloadData();
  }, [query]);

  const handleSearch = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (text) {
        setQuery({ supplier: text });
      } else {
        setQuery({});
      }
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
            onKeyDown={handleKeyDown} // type text to search box and enter -> start search
          />
        </div>
      </div>
      <ShowListBetrimex data={data} reloadData={reloadData} />
      {/* <Pagination /> */}
    </div>
  );
};

export default BetrimexStore;
