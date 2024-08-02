"use client";
import React, { useState } from "react";
import styles from "./showOrders.module.css";
import { Table, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";

function ShowOrders(props) {
  const { datas } = props;
  const router = useRouter();
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const handleCallOrder = (data) => {
    alert(`Called for item with _id: ${data._id}`);
    console.log("dataSend: ", data);
    localStorage.setItem("orderData", JSON.stringify(data));
    router.push("/dashboard/countingAFC");
  };

  return (
    <div className={styles.table_layout}>
      <Table striped bordered hover>
        <thead>
          <tr className={styles.tableRow}>
            <th>STT</th>
            <th>Ngày vào</th>
            <th>Biển số xe</th>
            <th>Trạng thái</th>
            <th>Đơn hàng</th>
            <th>Gọi vào kho</th>
          </tr>
        </thead>
        <tbody>
          {datas.map((data, i) => (
            <tr key={data._id} className={styles.tableRow}>
              <td>{i + 1}</td>
              <td>{data.date}</td>
              <td>{data.license_plate}</td>
              <td>{data.status}</td>
              <td>
                <Button onClick={() => toggleRow(i)}>
                  {expandedRow === i ? "Hide Details" : "Show Details"}
                </Button>
                {expandedRow === i && (
                  <div className={styles.details}>
                    <Table bordered size="sm" className={styles.ordersTable}>
                      <thead>
                        <tr>
                          <th>Order</th>
                          <th>Item</th>
                          <th>Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(data.orderslist).map(
                          ([orderName, items]) => {
                            const itemEntries = Object.entries(items);
                            return itemEntries.map(
                              ([item, quantity], index) => (
                                <tr
                                  key={`${orderName}-${item}`}
                                  className={styles.tableRow}
                                >
                                  {index === 0 && (
                                    <td rowSpan={itemEntries.length}>
                                      {orderName}
                                    </td>
                                  )}
                                  <td>{item}</td>
                                  <td>{quantity}</td>
                                </tr>
                              )
                            );
                          }
                        )}
                      </tbody>
                    </Table>
                  </div>
                )}
              </td>
              <td>
                <Button onClick={() => handleCallOrder(data)}>
                  Gọi vào kho
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default ShowOrders;
