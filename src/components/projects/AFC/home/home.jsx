"use client";
import React, { useEffect, useState } from "react";
import { Card, Alert } from "react-bootstrap";
import BagCounting from "../bagCounting/bagCounting";

const AFCHome = () => {
  //   const [data, setData] = useState(null);
  let data = {};

  const dataTestNoCombine = {
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

  data = { ...dataTestCombine };

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
      <BagCounting data={data} />
    </div>
  );
};

export default AFCHome;
