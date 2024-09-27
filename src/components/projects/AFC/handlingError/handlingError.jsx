"use client";
import React, { useEffect, useState } from "react";
import styles from "./handlingError.module.css";
import { v4 as uuidv4 } from "uuid";
import { Form, Button, Table, ListGroup } from "react-bootstrap";
import axios from "axios";
import NProgress from "../../../loadingBar/nprogress-config";

const HandlingError = () => {
  const [datas, setDatas] = useState([])
  const fetchConfuseData = async () => {
    try {
      NProgress.start()
      const response = await axios.post("http://192.168.100.134:5000/getConfuseData");
      const data = response.data;
      if (data.error) {
        setDatas([])
      } else {
        console.log("Data fetched successfully:", data);
        setDatas(data)
      }
      NProgress.done()
      console.log("Confuse Data:", data);
      // Handle the data as needed, e.g., set it to state
    } catch (error) {
      console.error("Error fetching confuse data:", error);
    }
  };

  useEffect(() => {
    fetchConfuseData(); // Fetch confuse data on component mount
  }, []);
  // const [datas, setDatas] = useState([
  //   {
  //     id: uuidv4(),
  //     gate: "Cổng 1",
  //     license_plate: "18C-123456",
  //     content: "Không nhận diện được",
  //     image: "/imgSP_0.png",
  //     itemsList: [
  //       "Order 1",
  //       "Order 2",
  //       "Order 10",
  //       "Order 19",
  //       "Order 99",
  //       "Order 100",
  //       "Order 101",
  //       "Order 102",
  //       "Order 103",
  //       "Order 104",
  //     ],
  //     isConfirm: false,
  //   },
  //   {
  //     id: uuidv4(),
  //     gate: "Cổng 1",
  //     license_plate: "18C-884568",
  //     content: "Không nhận diện được",
  //     image: "/imgSP_1.png",
  //     itemsList: ["Order5", "Order9"],
  //     isConfirm: false,
  //   },
  //   {
  //     id: uuidv4(),
  //     gate: "Cổng 1",
  //     license_plate: "18C-884568",
  //     content: "Không nhận diện được",
  //     image: "/imgSP_1.png",
  //     itemsList: ["Order2", "Order9"],
  //     isConfirm: false,
  //   },
  //   {
  //     id: uuidv4(),
  //     gate: "Cổng 1",
  //     license_plate: "18C-884568",
  //     content: "Không nhận diện được",
  //     image: "/imgSP_1.png",
  //     itemsList: ["Order5", "Order89"],
  //     isConfirm: false,
  //   },
  //   {
  //     id: uuidv4(),
  //     gate: "Cổng 1",
  //     license_plate: "18C-884568",
  //     content: "Không nhận diện được",
  //     image: "/imgSP_1.png",
  //     itemsList: ["Order45", "Order3"],
  //     isConfirm: false,
  //   },
  //   {
  //     id: uuidv4(),
  //     gate: "Cổng 1",
  //     license_plate: "18C-884568",
  //     content: "Không nhận diện được",
  //     image: "/imgSP_1.png",
  //     itemsList: ["Order9", "Order5"],
  //     isConfirm: false,
  //   },
  // ]);

  const [selectedItems, setSelectedItems] = useState({});

  const handleSelectItem = (item, rowIndex) => {
    setSelectedItems((prevState) => ({
      ...prevState,
      [rowIndex]: item,
    }));
  };

  const handleSubmit = (rowIndex) => {
    const selectedData = datas[rowIndex];
    const selectedItem = selectedItems[rowIndex];
    console.log("Selected Item: ", selectedItem);
    console.log("Data for this row: ", selectedData);

    // Xóa đơn hàng đã chọn
    setSelectedItems((prevState) => {
      const newState = { ...prevState };
      delete newState[rowIndex];
      return newState;
    });
    const data_send_API = {
      CameraID: selectedData.CameraID,
      DateTimeIn: selectedData.DateTimeIn,
      OrderName: selectedData.OrderName,
      PlateNumber: selectedData.PlateNumber,
      ProductCode: selectedItem,
      _id: selectedData._id
    }
    console.log("OK: ", JSON.stringify(data_send_API))
    alert(
      `Selected Item: ${selectedItem}, Data: ${JSON.stringify(data_send_API)}`
    );
    // Xóa hàng khỏi dữ liệu
    setDatas((prevDatas) => prevDatas.filter((_, index) => index !== rowIndex));
  };

  const handleNg = (rowIndex) => {
    const selectedData = datas[rowIndex];
    console.log("NG Button clicked for row: ", selectedData);
    
    // Xóa đơn hàng đã chọn
    setSelectedItems((prevState) => {
      const newState = { ...prevState };
      delete newState[rowIndex];
      return newState;
    });
    const data_send_API = {
      CameraID: selectedData.CameraID,
      DateTimeIn: selectedData.DateTimeIn,
      OrderName: selectedData.OrderName,
      PlateNumber: selectedData.PlateNumber,
      ProductCode: '',
      _id: selectedData._id
    }
    console.log("NG: ", JSON.stringify(data_send_API))
    alert(`NG clicked for Data: ${JSON.stringify(data_send_API)}`);

    // Xóa hàng khỏi dữ liệu
    setDatas((prevDatas) => prevDatas.filter((_, index) => index !== rowIndex));
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
              <tr key={data._id} className={styles.tableRow}>
                <td>{i}</td>
                <td>{data.CameraID}</td>
                <td>{data.PlateNumber}</td>
                <td>{data.Message}</td>
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
                      src={`data:image/jpeg;base64,${data.Image}`}
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
                    <div>
                      <Form.Control
                        type="text"
                        placeholder={
                          selectedItems[i] || "Chọn mã bao tương ứng ..."
                        }
                        readOnly
                        className="mb-3"
                      />
                      <ListGroup
                        style={{
                          width: "350px",
                          height: "200px",
                          overflowY: "scroll",
                          border: "1px solid lightgrey",
                          borderRadius: "4px",
                        }}
                      >
                        {data.Products.map((item) => (
                          <Button
                            key={item}
                            variant={
                              selectedItems[i] === item
                                ? "primary"
                                : "outline-secondary"
                            }
                            onClick={() => handleSelectItem(item, i)}
                            style={{ marginBottom: "5px", width: "100%" }}
                          >
                            {item}
                          </Button>
                        ))}
                      </ListGroup>
                    </div>
                    <div className="mt-3">
                      <Button
                        onClick={() => handleSubmit(i)}
                        disabled={!selectedItems[i]}
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

export default HandlingError;
