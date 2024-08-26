"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./home.module.css";
import Button from "react-bootstrap/Button";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const BetrimexHome = () => {
  const [formData, setFormData] = useState({
    lotCode: "",
    supplier: "",
    address: "",
    phoneNumber: "",
    coconutType: "",
  });

  const [confirmedCustomer, setConfirmedCustomer] = useState({});
  const [quantity, setQuantity] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  // const [receiveData, setReceiveData] = useState({});

  const insertData = async (data) => {
    const res = await fetch("http://localhost:5000/insertData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const isInsert = await res.json();
    if (isInsert) {
      toast.success("Đã lưu dữ liệu thành công!");
    }
  };

  const sendCommand = async (cmd) => {
    const res = await fetch("http://localhost:5000/sendCmd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cmd),
    });
    const isSend = await res.json();
    if (isSend) {
      console.log("Send command successfully !");
    } else {
      console.log("Send command unsuccessfully !");
    }
  };

  // receive data from TS2D app each 500ms
  useEffect(() => {
    const listenData = async () => {
      try {
        const response = await fetch("http://localhost:5000/receiveCmd");
        if (response.ok) {
          const data = await response.json();
          console.log("data: ", data);
          if (Array.isArray(data)) {
            data.forEach((jsonString) => {
              try {
                const result = JSON.parse(jsonString);
                console.log("Parsed data:", result);
                //   const result = JSON.parse(data);
                // console.log("status: ", result.status);
                // console.log("finish: ", result.finish);
                if (result.status === "reset") {
                  setQuantity(0);
                }
                if (result.status === "run") {
                  setQuantity(result.quantity);
                }
                if (result.status === "stop" && result.finish === "true") {
                  setQuantity(result.quantity);
                  const time = new Date().toLocaleString();
                  const data = {
                    ...confirmedCustomer,
                    quantity: String(result.quantity),
                    time: time,
                  };
                  console.log("data: ", data);
                  insertData(data); // save final data to database

                  // Reset form data after confirmation
                  setFormData({
                    lotCode: "",
                    supplier: "",
                    address: "",
                    phoneNumber: "",
                    coconutType: "",
                  });
                  setQuantity(0);
                }
              } catch (error) {
                console.error("Error parsing JSON:", error);
                console.error("jsonString: ", jsonString);
              }
            });
          } else {
            console.error("Data is not an array:", data);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Call listenData every 300 miliseconds, because data will return from TS2D every 500 miliseconds, then need to listen ealier a little bit
    const intervalId = setInterval(listenData, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [confirmedCustomer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleConfirmClick = () => {
    if (!formData.supplier) {
      toast.error("Chưa nhập tên nhà cung cấp!");
      return;
    }
    if (!formData.coconutType) {
      toast.error("Chưa nhập loại dừa!");
      return;
    }
    if (!formData.address) {
      toast.error("Chưa nhập địa chỉ!");
      return;
    }
    if (!formData.lotCode) {
      toast.error("Chưa nhập mã lô dừa!");
      return;
    }
    if (!formData.phoneNumber) {
      toast.error("Chưa nhập số điện thoại!");
      return;
    }
    setConfirmedCustomer({ ...formData });
    console.log("Mã Lô dừa:", formData.lotCode);
    console.log("Nhà cung cấp:", formData.supplier);
    console.log("Địa chỉ:", formData.address);
    console.log("Số điện thoại:", formData.phoneNumber);
    console.log("Loại dừa:", formData.coconutType);

    setIsButtonDisabled((prev) => !prev);
    setQuantity(0);
    sendCommand({ command: "start" }); // Start counting
    toast.success("Nhập thông tin nhà cung cấp thành công!");
  };

  const handleStopClick = () => {
    setIsButtonDisabled(false);
    sendCommand({ command: "stop" }); // Stop counting
  };

  return (
    <div>
      <div className={styles.section}>
        <div className={styles.customerInfo}>
          <div className={styles.label}>
            <h2 className={styles.text}>Thông tin khách hàng</h2>
          </div>
          <div className={styles.inputData}>
            <div className={styles.codeInput}>
              <p className={styles.labelText}> Mã Lô dừa</p>
              <input
                type="text"
                className={styles.inputText}
                placeholder=""
                name="lotCode"
                value={formData.lotCode}
                onChange={handleChange}
              />
            </div>
            <div className={styles.codeInput}>
              <p className={styles.labelText}> Nhà cung cấp</p>
              <input
                type="text"
                className={styles.inputText}
                placeholder=""
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
              />
            </div>
            <div className={styles.codeInput}>
              <p className={styles.labelText}> Địa chỉ</p>
              <input
                type="text"
                className={styles.inputText}
                placeholder=""
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className={styles.codeInput}>
              <p className={styles.labelText}> Số điện thoại</p>
              <input
                type="text"
                className={styles.inputText}
                placeholder=""
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            <div className={styles.codeInput}>
              <p className={styles.labelText}> Loại dừa</p>
              <input
                type="text"
                className={styles.inputText}
                placeholder=""
                name="coconutType"
                value={formData.coconutType}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className={styles.btn}>
            <Button disabled={isButtonDisabled} onClick={handleConfirmClick}>
              Xác nhận
            </Button>
            <Button disabled={!isButtonDisabled} onClick={handleStopClick}>
              Dừng
            </Button>
          </div>
        </div>
        <div className={styles.countingStatus}>
          <div>
            <h3 className={styles.label}>
              Đang lấy dừa từ nhà cùng cấp:{" "}
              <span>{confirmedCustomer.supplier}</span>
            </h3>
          </div>
          <h3 className={styles.label}>Số lượng</h3>
          <div className={styles.counting}>{quantity}</div>
        </div>
      </div>
    </div>
  );
};

export default BetrimexHome;
