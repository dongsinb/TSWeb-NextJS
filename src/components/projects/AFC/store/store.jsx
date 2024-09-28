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

function AFCStore(props) {
  const { datas } = props;

  useEffect(() => {
    console.log("datas AFC: ", datas);
  }, [datas]);

  const waitingOrders = datas["Waiting"].map((order) => ({
    ...order,
    Status: "Waiting",
  }));
  const finishedOrders = datas["Finished"].map((order) => ({
    ...order,
    Status: "Finished",
  }));

  useEffect(() => {
    console.log("waitingOrders: ", waitingOrders);
    console.log("finishedOrders: ", finishedOrders);
  }, [waitingOrders, finishedOrders]);


  return (
    <div>
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
