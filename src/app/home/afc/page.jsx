"use client";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import styles from "./afc.module.css";
import ShowOrders from "../../../components/projects/AFC/ordersList/showOrders";
import ExcelJS from "exceljs";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

function AFCPage(props) {
  const datas = [
    {
      _id: "6690a14e7fda34bff6b56f0c",
      date: "27-06-2024",
      license_plate: "80B-33333",
      status: "Waitting",
      orderslist: {
        order_1: { 1040: 5, "1020-25": 40 },
        order_2: { "VV1-25": 10, "CA01-25-40": 10 },
        order_10: { "301SP-25": 20, "CE22-25-40": 10 },
        order_19: { "302SP-25": 40, "CA44-25-40": 50 },
        order_99: { "302SP-25": 450, "CA01-25-30": 150 },
      },
    },
    {
      _id: "6695e58e196888685dac2aad",
      date: "27-06-2024",
      license_plate: "80A-4545",
      status: "Waitting",
      orderslist: { Don1: { 1040: 5, "1020-25": 40 } },
    },
    {
      _id: "6695e5ab196888685ac2aae",
      date: "27-06-2024",
      license_plate: "80A-5545",
      status: "Waitting",
      orderslist: { Don1: { 1040: 50, "1050-25": 100 } },
    },
    {
      _id: "6695e60119688885dac2aaf",
      date: "27-06-2024",
      license_plate: "80A-8888",
      status: "Waitting",
      orderslist: { Don10: { 2040: 50, "1050-25": 100 } },
    },
    {
      _id: "6695e60119688865dac2aaf",
      date: "27-06-2024",
      license_plate: "80A-8888",
      status: "Finished",
      orderslist: { Don10: { 2040: 50, "1050-25": 100 } },
    },
    {
      _id: "6695e60196888685dac2aaf",
      date: "27-06-2024",
      license_plate: "80A-8888",
      status: "Finished",
      orderslist: { Don10: { 2040: 50, "1050-25": 100 } },
    },
    {
      _id: "6695e01196888685dac2aaf",
      date: "27-06-2024",
      license_plate: "80A-8888",
      status: "Called",
      orderslist: { Don10: { 2040: 50, "1050-25": 100 } },
    },
  ];

  const filterOrdersByStatus = (status) => {
    return datas.filter((data) => data.status === status);
  };
  const waitingOrders = filterOrdersByStatus("Waitting");
  const finishedOrders = filterOrdersByStatus("Finished");
  const calledOrders = filterOrdersByStatus("Called");

  const [fileData, setFileData] = useState([]);
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const workbook = new ExcelJS.Workbook();
      try {
        // Đọc file Excel
        await workbook.xlsx.load(file);
        const worksheet = workbook.worksheets[0];
        const jsonData = worksheet.getSheetValues();

        // Xử lý dữ liệu và cập nhật state
        console.log("Data from file:", jsonData);
        setFileData(jsonData); // Lưu dữ liệu vào state
      } catch (err) {
        console.error("Failed to read file. Ensure it is a valid Excel file.");
      }
    }
  };

  return (
    <div>
      <Tabs
        defaultActiveKey="Waitting"
        id="justify-tab-example"
        className="mb-3"
        justify
      >
        <Tab
          eventKey="Waitting"
          title="Xe chưa lấy hàng"
          className={styles.tabName}
        >
          <div className={styles.showLayout}>
            <div className="mt-2 mb-2">
              <Form.Group>
                <Form.Control
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                />
              </Form.Group>
            </div>
            <h5 className={styles.label}>Danh sách xe</h5>
            {/* File Upload */}
            <InputGroup className="mb-3">
              <Form.Control placeholder="Nhập biển số xe" />
              <Button variant="outline-secondary" id="button-addon2">
                Search
              </Button>
            </InputGroup>
            <ShowOrders datas={waitingOrders} status={"Waiting"}></ShowOrders>
          </div>
        </Tab>
        <Tab eventKey="Called" title="Xe đang lấy hàng">
          <div className={styles.showLayout}>
            <h5 className={styles.label}>Danh sách xe</h5>
            <InputGroup className="mb-3">
              <Form.Control placeholder="Nhập biển số xe" />
              <Button variant="outline-secondary" id="button-addon2">
                Search
              </Button>
            </InputGroup>
            <ShowOrders datas={calledOrders} status={"Called"}></ShowOrders>
          </div>
        </Tab>
        <Tab eventKey="Finished" title="Xe đã lấy hàng">
          <div className={styles.showLayout}>
            <h5 className={styles.label}>Danh sách xe</h5>
            <InputGroup className="mb-3">
              <Form.Control placeholder="Nhập biển số xe" />
              <Button variant="outline-secondary" id="button-addon2">
                Search
              </Button>
            </InputGroup>
            <ShowOrders datas={finishedOrders} status={"Finished"}></ShowOrders>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export default AFCPage;
