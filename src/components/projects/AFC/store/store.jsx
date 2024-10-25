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
import axios from "axios";
import { toast } from "react-toastify";
import config from "../../../../app/config";

function AFCStore(props) {
  const { datas, dateTime } = props;
  console.log("dateTime: ", dateTime);
  const [plateNumber, setPlateNumber] = useState("");
  const [waitingOrders, setWaitingOrders] = useState([]);
  const [finishedOrders, setFinishedOrders] = useState([]);
  const [selectedDateTime, setSelectedDateTime] = useState(dateTime);

  const handleDateChange = (event) => {
    setSelectedDateTime(event.target.value);
  };

  useEffect(() => {
    console.log("datas AFC: ", datas);
    // Cập nhật waitingOrders và finishedOrders khi datas thay đổi
    setWaitingOrders(
      datas["Waiting"].map((order) => ({
        ...order,
        Status: "Waiting",
      }))
    );
    setFinishedOrders(
      datas["Finished"].map((order) => ({
        ...order,
        Status: "Finished",
      }))
    );
  }, [datas]);

  const handleSearchByPlate = async () => {
    console.log("test sear");
    if (plateNumber === "") {
      toast.warn("Biển số xe không được để trống.");
      return;
    } else {
      try {
        const response = await axios.post(
          `${config.API_BASE_URL}/getDatabyPlateNumber`,
          {
            PlateNumber: plateNumber,
          }
        );
        const datasSearch = response.data;
        setWaitingOrders(
          datasSearch["Waiting"].map((order) => ({
            ...order,
            Status: "Waiting",
          }))
        );
        setFinishedOrders(
          datasSearch["Finished"].map((order) => ({
            ...order,
            Status: "Finished",
          }))
        );
        // Xử lý dữ liệu nhận được nếu cần
      } catch (error) {
        console.error("Có lỗi xảy ra khi tìm kiếm:", error);
      }
    }
  };

  return (
    <div>
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Nhập biển số xe"
          value={plateNumber} // Liên kết giá trị với state
          onChange={(e) => setPlateNumber(e.target.value)} // Cập nhật state khi thay đổi
        />
        {/* <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          customInput={<ExampleCustomInput className="example-custom-input" />}
        /> */}
        <input
          type="date"
          id="date"
          value={selectedDateTime}
          onChange={handleDateChange}
        />
        <Button
          variant="outline-secondary"
          id="button-addon2"
          onClick={handleSearchByPlate}
        >
          Tìm kiếm
        </Button>
      </InputGroup>
      <Tabs
        defaultActiveKey="Waiting"
        id="justify-tab-example"
        className="mb-3"
        justify
      >
        <Tab
          eventKey="Waiting"
          title="Xe chưa lấy hàng"
          className={styles.tabName}
        >
          <div className={styles.showLayout}>
            <h5 className={styles.label}>Danh sách xe</h5>
            <ShowOrders datas={waitingOrders} status={"Waiting"}></ShowOrders>
          </div>
        </Tab>
        <Tab eventKey="Finished" title="Xe đã lấy hàng">
          <div className={styles.showLayout}>
            <h5 className={styles.label}>Danh sách xe</h5>
            <ShowOrders datas={finishedOrders} status={"Finished"}></ShowOrders>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export default AFCStore;
