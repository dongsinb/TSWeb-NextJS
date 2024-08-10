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

  const [confirmedSupplier, setConfirmedSupplier] = useState("");
  const [confirmedCustomer, setConfirmedCustomer] = useState({});
  const [quantity, setQuantity] = useState(0);

  // Correct use of useEffect at the top level
  useEffect(() => {
    console.log("confirmedCustomer updated: ", confirmedCustomer);
  }, [confirmedCustomer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("Change detected");
    console.log("Input name:", name);
    console.log("Input value:", value);

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
    if (!formData.lotCode) {
      toast.error("Chưa nhập mã lô dừa!");
      return;
    }
    if (!formData.phoneNumber) {
      toast.error("Chưa nhập số điện thoại!");
      return;
    }
    setConfirmedSupplier(formData.supplier);
    setConfirmedCustomer({ ...formData });
    console.log("Mã Lô dừa:", formData.lotCode);
    console.log("Nhà cung cấp:", formData.supplier);
    console.log("Địa chỉ:", formData.address);
    console.log("Số điện thoại:", formData.phoneNumber);
    console.log("Loại dừa:", formData.coconutType);

    // Reset form data after confirmation
    setFormData({
      lotCode: "",
      supplier: "",
      address: "",
      phoneNumber: "",
      coconutType: "",
    });
    setIsButtonDisabled((prev) => !prev);
    setQuantity(0);
    toast.success("Nhập thông tin nhà cung cấp thành công!");
  };

  const handleStopClick = () => {
    const time = new Date().toLocaleString();
    console.log("quantity: ", quantity);
    console.log("confirmedCustomer: ", confirmedCustomer);
    const result = { ...confirmedCustomer, quantity, time };
    console.log("result: ", result);
    setIsButtonDisabled(false);
  };

  // Function to increment the count
  const IncrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  // Disable button after click start
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

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
            <button
              className={styles.btnConfirm}
              disabled={isButtonDisabled}
              onClick={handleConfirmClick}
            >
              Xác nhận
            </button>
            <button
              className={styles.btnStop}
              disabled={!isButtonDisabled}
              onClick={handleStopClick}
            >
              Dừng
            </button>
            <button
              className={styles.btnCount}
              onClick={() => IncrementQuantity()}
            >
              Test Increment Quantity
            </button>
            <Button variant="primary">Primary</Button>
          </div>
        </div>
        <div className={styles.countingStatus}>
          <div>
            <h3 className={styles.label}>
              Đang lấy dừa từ nhà cùng cấp: <span>{confirmedSupplier}</span>
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
