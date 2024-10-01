"use client";
import styles from "./store.module.css";
import AFCStore from "../../../components/projects/AFC/store/store";
import axios from "axios";
import NProgress from "../../../components/loadingBar/nprogress-config";
import { useEffect, useState } from "react";

const StorePage = () => {
  const [datas, setDatas] = useState({ Called: [], Finished: [], Waiting: [] });

  useEffect(() => {
    const fetchData = async () => {
      console.log("Checkkkk resfesk: ");
      NProgress.start();
      try {
        let response = await axios("http://192.168.100.134:5000/getOrderData", {
          method: "POST",
          timeout: 10000 
        });

        let result = await response.data;
        setDatas(result);
        console.log("dữ liệu: ", result);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        if (error.code === 'ECONNABORTED') {
          console.error("Yêu cầu đã hết thời gian chờ");
        }
      } finally {
        NProgress.done();
      }
    };

    fetchData();
  }, []);

  const newData = {
    Called: [],
    Finished: [
      {
        DateTimeIn: "2024-06-11T00:00:00+07:00",
        Orders: {
          "0061478858": {
            "111G-25": { CurrentQuantity: 0, ProductCount: 25 },
            "212S-25": { CurrentQuantity: 0, ProductCount: 25 },
            "221G-25": { CurrentQuantity: 0, ProductCount: 25 },
            "2220-25": { CurrentQuantity: 0, ProductCount: 25 },
            _id: "66e94149a56399da40148afc",
          },
        },
        PlateNumber: "20C19248",
      },
      {
        DateTimeIn: "2024-06-11T00:00:00+07:00",
        Orders: {
          "0071478858": {
            "1220-25": { CurrentQuantity: 0, ProductCount: 25 },
            "211G-25": { CurrentQuantity: 0, ProductCount: 25 },
            "213S-25": { CurrentQuantity: 0, ProductCount: 25 },
            "221G-25": { CurrentQuantity: 0, ProductCount: 25 },
            _id: "66e941b4a56399da40148afd",
          },
        },
        PlateNumber: "19C19248",
      },
    ],
    Waiting: [
      {
        DateTimeIn: "2024-06-12T00:00:00+07:00",
        Orders: {
          "0011478858": {
            "211G-25": { CurrentQuantity: 0, ProductCount: 20 },
            "212G-25": { CurrentQuantity: 0, ProductCount: 20 },
            "302S-25": { CurrentQuantity: 0, ProductCount: 20 },
            "G200-25": { CurrentQuantity: 0, ProductCount: 20 },
            _id: "66e93f89a56399da40148af7",
          },
          "0021478858": {
            "302S-25": { CurrentQuantity: 0, ProductCount: 30 },
            "311G-25": { CurrentQuantity: 0, ProductCount: 30 },
            "312G-25": { CurrentQuantity: 0, ProductCount: 30 },
            "G200-25": { CurrentQuantity: 0, ProductCount: 30 },
            _id: "66e9405aa56399da40148af8",
          },
          "0031478858": {
            "202S-25": { CurrentQuantity: 0, ProductCount: 40 },
            "212G-25": { CurrentQuantity: 0, ProductCount: 40 },
            "321G-25": { CurrentQuantity: 0, ProductCount: 40 },
            "G200-25": { CurrentQuantity: 0, ProductCount: 40 },
            _id: "66e940a6a56399da40148af9",
          },
        },
        PlateNumber: "20C19248",
      },
      {
        DateTimeIn: "2024-06-12T00:00:00+07:00",
        Orders: {
          "0041478858": {
            "111G-25": { CurrentQuantity: 0, ProductCount: 50 },
            "112S-25": { CurrentQuantity: 0, ProductCount: 50 },
            "122G-25": { CurrentQuantity: 0, ProductCount: 50 },
            "2220-25": { CurrentQuantity: 0, ProductCount: 50 },
            _id: "66e940e4a56399da40148afa",
          },
          "0051478858": {
            "111G-25": { CurrentQuantity: 0, ProductCount: 60 },
            "121G-25": { CurrentQuantity: 0, ProductCount: 60 },
            "212S-25": { CurrentQuantity: 0, ProductCount: 60 },
            "2220-25": { CurrentQuantity: 0, ProductCount: 60 },
            _id: "66e9411fa56399da40148afb",
          },
        },
        PlateNumber: "19C19248",
      },
    ],
  };

  const datas11111 = [
    {
      _id: "6690a14e7fda34bff6b56f0c",
      PlateNumber: "20C19248",
      DateTimeIn: "2024-06-12T00:00:00+07:00",
      Status: "Waiting",
      Orders: [
        {
          Order1: [
            { ProductCode: "212G-25", ProductCount: 25, CurrentQuantity: 0 },
            { ProductCode: "211G-25", ProductCount: 55, CurrentQuantity: 0 },
            { ProductCode: "302S-25", ProductCount: 35, CurrentQuantity: 0 },
            { ProductCode: "G200-25", ProductCount: 45, CurrentQuantity: 0 },
          ],
        },
        {
          Order2: [
            { ProductCode: "VV1-25", ProductCount: 20, CurrentQuantity: 0 },
            { ProductCode: "211G-25", ProductCount: 50, CurrentQuantity: 0 },
          ],
        },
      ],
    },
    {
      _id: "6695e58e196888685dac2aad",
      PlateNumber: "30C12345",
      DateTimeIn: "2024-06-12T00:00:00+07:00",
      Status: "Waiting",
      Orders: [
        {
          "0061478858": [
            { ProductCode: "VV1-25", ProductCount: 20, CurrentQuantity: 0 },
            { ProductCode: "211G-25", ProductCount: 50, CurrentQuantity: 0 },
          ],
        },
      ],
    },
  ];

  const datasOld = [
    {
      _id: "6690a14e7fda34bff6b56f0c",
      date: "27-06-2024",
      license_plate: "80B-33333",
      Status: "Waiting",
      orderslist: {
        order_1: { "1040-25": 5, "1020-25": 40 },
        order_2: { "VV1-25": 10, "CA01-25-40": 10 },
        order_10: { "301SP-25": 20, "CE22-25-40": 10 },
        order_19: { "302SP-25": 40, "CA44-25-40": 50 },
        order_99: { "302SP-25": 450, "CA01-25-30": 150 },
      },
    },
  ];
  return (
    <div className={styles.container}>
      <AFCStore datas={datas}></AFCStore>
    </div>
  );
};

export default StorePage;
