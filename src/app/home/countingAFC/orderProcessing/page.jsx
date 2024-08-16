"use client";
import React, { useState } from "react";
import styles from "./orderProcessing.module.css";
import { v4 as uuidv4 } from "uuid";
import { Form, Button, Table, ListGroup, ListGroupItem } from "react-bootstrap";
import Image from "next/image";
const OrderProcessing = () => {
  const datas = [
    {
      id: uuidv4(),
      gate: "Cổng 1",
      license_plate: "18C-123456",
      content: "Không nhận diện được",
      image: "/imgSP_0.png",
      ordersList: [
        "Order 1",
        "Order 2",
        "Order 10",
        "Order 19",
        "Order 99",
        "Order 100",
        "Order 101",
        "Order 102",
        "Order 103",
        "Order 104",
      ],
      isConfirm: false,
    },
    {
      id: uuidv4(),
      gate: "Cổng 1",
      license_plate: "18C-884568",
      content: "Không nhận diện được",
      image: "/imgSP_1.png",
      ordersList: ["Order5", "Order9"],
      isConfirm: false,
    },
  ];
  // Trạng thái lưu trữ đơn hàng được chọn cho mỗi hàng
  const [selectedOrders, setSelectedOrders] = useState({});

  const handleSelectOrder = (order, rowIndex) => {
    setSelectedOrders((prevState) => ({
      ...prevState,
      [rowIndex]: order,
    }));
  };

  const handleSubmit = (rowIndex) => {
    const selectedData = datas[rowIndex];
    const selectedOrder = selectedOrders[rowIndex];
    console.log("Selected Order: ", selectedOrder);
    console.log("Data for this row: ", selectedData);

    // Bạn có thể làm gì đó với selectedOrder và selectedData ở đây
    alert(
      `Selected Order: ${selectedOrder}, Data: ${JSON.stringify(selectedData)}`
    );
  };

  const handleNg = (rowIndex) => {
    const selectedData = datas[rowIndex];
    console.log("NG Button clicked for row: ", selectedData);

    // Bạn có thể làm gì đó với selectedData ở đây
    alert(`NG clicked for Data: ${JSON.stringify(selectedData)}`);
  };

  return (
    <div className={styles.orderProcessingBody}>
      <div className={styles.table_layout}>
        <Table striped bordered hover>
          <thead>
            <tr className={styles.tableRow}>
              <th>STT</th>
              <th>Cổng</th>
              <th>Biển Số</th>
              <th>Nội Dung</th>
              <th>Ảnh</th>
              <th>Xử lý</th>
            </tr>
          </thead>
          <tbody>
            {datas.map((data, i) => (
              <tr key={data.id} className={styles.tableRow}>
                <td>{i}</td>
                <td>{data.gate}</td>
                <td>{data.license_plate}</td>
                <td>{data.content}</td>
                <td
                  style={{
                    width: "500px",
                    height: "200px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={data.image}
                      alt="logo"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </td>
                <td>
                  <div className={styles.processingCell}>
                    <div
                      style={{
                        width: "350px",
                        height: "200px",
                        overflowY: "auto",
                        border: "1px solid lightgrey",
                        borderRadius: "4px",
                      }}
                    >
                      <ListGroup>
                        {data.ordersList.map((order) => (
                          <ListGroup.Item key={order}>
                            <Form.Check
                              type="radio"
                              name={`orderRadio-${i}`}
                              id={order}
                              checked={selectedOrders[i] === order}
                              onChange={() => handleSelectOrder(order, i)}
                              label={order}
                            />
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </div>
                    <div class="mt-3">
                      <Button
                        onClick={() => handleSubmit(i)}
                        disabled={!selectedOrders[i]}
                      >
                        OK
                      </Button>
                      <Button variant="danger" onClick={() => handleNg(i)}>
                        NG
                      </Button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default OrderProcessing;
