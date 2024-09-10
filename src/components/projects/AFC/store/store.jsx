"use client";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import styles from "./store.module.css";
import ShowOrders from "../ordersList/showOrders";
import ExcelJS from "exceljs";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { DateTime } from "luxon";

function AFCStore(props) {
  const { datas } = props;
  const filterOrdersByStatus = (status) => {
    return datas.filter((data) => data.status === status);
  };
  const waitingOrders = filterOrdersByStatus("Waitting");
  const finishedOrders = filterOrdersByStatus("Finished");
  const calledOrders = filterOrdersByStatus("Called");

  const [file, setFile] = useState(null);
  const [excelData, setExcelData] = useState(null);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  useEffect(() => {
    console.log("excelData: ", excelData);
  }, [excelData]);

  const handleAddOrder = async (event) => {
    if (file) {
      const workbook = new ExcelJS.Workbook();
      try {
        await workbook.xlsx.load(file);
        const worksheet = workbook.worksheets[0];
        const valueJ3 = worksheet.getCell("J3").value;
        const valueJ7 = worksheet.getCell("J7").value;
        const valueI8 = worksheet.getCell("I8").value;

        console.log("Value at J3:", valueJ3.result);
        console.log("Value at J7:", valueJ7);
        console.log("Value at I8:", valueI8);

        const rows = [];

        let rowNumber = 11;

        while (true) {
          const cellB = worksheet.getCell(`B${rowNumber}`).value;
          const cellG = worksheet.getCell(`G${rowNumber}`).value;

          if (cellB === null || cellG === null) break;

          rows.push({
            ProductCode: cellB,
            Quantity: cellG,
            CurrentQuanity: 0,
          });

          rowNumber++;
        }

        const date = DateTime.fromJSDate(new Date(valueJ3.result));
        const formattedDate = date.toISO();
        console.log(formattedDate); // "2024-09-09T07:00:00.000+07:00"

        setExcelData({
          PlateNumber: valueI8,
          DateTimeIn: formattedDate,
          OrderName: valueJ7,
          Orders: rows,
          status: "Waitting",
        });
      } catch (err) {
        console.error(
          "Failed to read file. Ensure it is a valid Excel file.",
          err
        );
      }
    } else {
      console.error("No file selected.");
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
                <Button
                  variant="outline-secondary"
                  id="button-addon2"
                  onClick={handleAddOrder}
                >
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
