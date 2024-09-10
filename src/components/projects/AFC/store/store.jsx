"use client";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import styles from "./store.module.css";
import ShowOrders from "../ordersList/showOrders";
import ExcelJS from "exceljs";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

function AFCStore(props) {
  const { datas } = props;
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
        await workbook.xlsx.load(file);
        const worksheet = workbook.worksheets[0];
        const jsonData = worksheet.getRow();
        const valueJ3 = worksheet.getCell("J3").value;
        const valueJ7 = worksheet.getCell("J7").value;
        const valueI8 = worksheet.getCell("I8").value;

        console.log("Value at J3:", valueJ3.result);
        console.log("Value at J7:", valueJ7);
        console.log("Value at I8:", valueI8);
        // console.log("Data from file:", jsonData);
        setFileData(jsonData);
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
              <InputGroup>
                <Form.Control
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                />
                <Button variant="outline-secondary" id="button-addon2">
                  Thêm đơn hàng
                </Button>
              </InputGroup>
            </div>
            <h5 className={styles.label}>Danh sách xe</h5>
            {/* File Upload */}
            <InputGroup className="mb-3">
              <Form.Control placeholder="Nhập biển số xe" />
              <Button variant="outline-secondary" id="button-addon2">
                Tìm Kiếm
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

export default AFCStore;
