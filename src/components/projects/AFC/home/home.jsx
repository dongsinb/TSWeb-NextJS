"use client";
import React, { useEffect, useState } from "react";
import { Card, Alert, Button } from "react-bootstrap";
import BagCounting from "../bagCounting/bagCounting";
import axios from "axios";

const AFCHome = () => {
  const [data, setData] = useState({});
  // let data = {};

  const dataTestNoCombine_old = {
    DateTimeIn: "2024-09-16T07:00:00.000+07:00",
    IsCombine: false,
    Orders: [
      {
        Test0061486509: [
          { CurrentQuantity: 0, ProductCode: "9090-05", ProductCount: 10 },
          { CurrentQuantity: 0, ProductCode: "GO2-25", ProductCount: 20 },
        ],
      },
      {
        "0061486509": [
          { CurrentQuantity: 0, ProductCode: "1000-05", ProductCount: 1 },
          { CurrentQuantity: 0, ProductCode: "W100S-25", ProductCount: 2 },
          { CurrentQuantity: 0, ProductCode: "1020-25", ProductCount: 120 },
          { CurrentQuantity: 0, ProductCode: "3020-25", ProductCount: 120 },
          { CurrentQuantity: 0, ProductCode: "CA02-25-30", ProductCount: 5 },
          { CurrentQuantity: 0, ProductCode: "1050-25", ProductCount: 7 },
        ],
      },
    ],
    PlateNumber: "34C09690",
    SortList: ["Test0061486509", "0061486509"],
    _id: "66e79c8aa7ec9f3c82288464",
  };

  const dataTestCombine = {
    DateTimeIn: "2024-09-16T07:00:00.000+07:00",
    IsCombine: true,
    Orders: [
      {
        order: [
          { CurrentQuantity: 0, ProductCode: "1000-05", ProductCount: 1 },
          { CurrentQuantity: 0, ProductCode: "W100S-25", ProductCount: 2 },
          { CurrentQuantity: 0, ProductCode: "1020-25", ProductCount: 120 },
          { CurrentQuantity: 0, ProductCode: "3020-25", ProductCount: 120 },
          { CurrentQuantity: 0, ProductCode: "CA02-25-30", ProductCount: 5 },
          { CurrentQuantity: 0, ProductCode: "1050-25", ProductCount: 7 },
          { CurrentQuantity: 0, ProductCode: "9090-05", ProductCount: 10 },
          { CurrentQuantity: 0, ProductCode: "GO2-25", ProductCount: 20 },
        ],
      },
    ],
    PlateNumber: "34C09690",
    SortList: ["Test0061486509", "0061486509"],
    _id: "66e79c8aa7ec9f3c82288464",
  };

  const dataTestNoCombine_new = {
    DateTimeIn: "2024-06-12T00:00:00+07:00",
    IsCombine: false,
    Orders: {
      "0041478858": {
        "111G-25": { CurrentQuantity: 0, ProductCount: 25 },
        "112S-25": { CurrentQuantity: 0, ProductCount: 25 },
        "122G-25": { CurrentQuantity: 0, ProductCount: 25 },
        "2220-25": { CurrentQuantity: 0, ProductCount: 25 },
        _id: "66e940e4a56399da40148afa"
      },
      "0051478858": {
        "111G-25": { CurrentQuantity: 0, ProductCount: 25 },
        "121G-25": { CurrentQuantity: 0, ProductCount: 25 },
        "212S-25": { CurrentQuantity: 0, ProductCount: 25 },
        "2220-25": { CurrentQuantity: 0, ProductCount: 25 },
        _id: "66e9411fa56399da40148afb"
      }
    },
    PlateNumber: "19C19248",
    SortList: ["0051478858", "0041478858"],
    isAllOrderFull: true
  };
  const dataTestCombine_new = {
    "DateTimeIn": "2024-06-12T00:00:00+07:00",
    "IsCombine": true,
    "Orders": {
        "ordername": {
            "111G-25": {
                "CurrentQuantity": 0,
                "ProductCount": 50
            },
            "112S-25": {
                "CurrentQuantity": 0,
                "ProductCount": 25
            },
            "121G-25": {
                "CurrentQuantity": 0,
                "ProductCount": 25
            },
            "122G-25": {
                "CurrentQuantity": 0,
                "ProductCount": 25
            },
            "212S-25": {
                "CurrentQuantity": 0,
                "ProductCount": 25
            },
            "2220-25": {
                "CurrentQuantity": 0,
                "ProductCount": 50
            }
        }
    },
    "PlateNumber": "19C19248",
    "SortList": [
        "0051478858",
        "0041478858"
    ]
}
  // data = { ...dataTestNoCombine_new };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://192.168.100.134:5000/getCountingData"
        );
        console.log("response.data", response.data);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData({})
      }
    };

    fetchData(); // Initial fetch
    const intervalId = setInterval(fetchData, 1000); // Fetch every 1 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const handleRefreshCountingData = () => {
    const request = {Message: "Refresh Counting"}
  }
  if (data && Object.keys(data).length === 0) {
    return (
      <Card className="text-center" style={{ marginTop: "20px" }}>
        <Card.Body>
          <Card.Title>Không có dữ liệu</Card.Title>
          <Card.Text>Chưa có đơn hàng được gọi</Card.Text>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div>
      <h4 style={{ color: "white" }}>Counting AFC</h4>
      <Button variant="outline-info" onClick={handleRefreshCountingData} style={{ marginBottom: '10px' }}>
        Làm mới đơn hàng
      </Button>
      <BagCounting data={data} />
    </div>
  );
};

export default AFCHome;
