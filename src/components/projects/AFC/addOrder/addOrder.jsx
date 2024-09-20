"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import ExcelJS from "exceljs";
import Button from "react-bootstrap/Button";
import { DateTime } from "luxon";
import DisplayAddedOrders from './displayAddedOrders/DisplayAddedOrders';
import styles from './displayAddedOrders/addorder.module.css';
import { toast } from 'react-toastify';

const AddOrder = () => {
    const [file, setFile] = useState(null);
    const [excelData, setExcelData] = useState(null);
    useEffect(() => {
        console.log("excelData: ", JSON.stringify(excelData));
    }, [excelData]);
    const handleFileUpload = (event) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile) {
          setFile(uploadedFile);
        }
      };
      const handleAddOrder = async (event) => {
        if (file) { 
          const workbook = new ExcelJS.Workbook();
          try {
            await workbook.xlsx.load(file);
            const allRows = {};

            workbook.worksheets.forEach((worksheet, index) => {
                const sheetName = worksheet.name;
                const valueJ3 = worksheet.getCell("J3").value;
                const valueJ7 = worksheet.getCell("J7").value;
                const valueI8 = worksheet.getCell("I8").value;

                console.log(`Sheet ${index + 1} - Name:`, sheetName);
                console.log(`Sheet ${index + 1} - Value at J3:`, valueJ3.result);
                console.log(`Sheet ${index + 1} - Value at J7:`, valueJ7);
                console.log(`Sheet ${index + 1} - Value at I8:`, valueI8);

                let rows = {};
                let rowNumber = 11;

                while (true) {
                    const cellB = worksheet.getCell(`B${rowNumber}`).value;
                    const cellG = worksheet.getCell(`G${rowNumber}`).value;

                    if (cellB === null || cellG === null) break;

                    const productCode = cellB.toUpperCase();
                    rows[productCode] = {
                        ProductCount: cellG,
                        CurrentQuantity: 0,
                    };

                    rowNumber++;
                }
                const date = DateTime.fromJSDate(new Date(valueJ3.result));
                const formattedDate = date.toISO();
                console.log(`Sheet ${index + 1} - Formatted Date:`, formattedDate);

                allRows[sheetName] = {
                    PlateNumber: valueI8,
                    DateTimeIn: formattedDate,
                    OrderName: valueJ7,
                    Orders: rows,
                    Status: "Waiting",
                };
            });

            setExcelData(allRows);
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
    const handleRemoveOrder = (key) => {
        setExcelData((prevData) => {
            const newData = { ...prevData };
            delete newData[key];
            return newData;
        });
    };
    const handleConfirmOrder = async(sheetName, confirmOrder) => {
        console.log("confirmOrder: ", confirmOrder);
        try {
          const response = await axios.post(
            "http://192.168.100.134:5000/insertData",
            confirmOrder
          );
          console.log("Response from server:", response.data);
          toast.success(`Thêm đơn hàng "${sheetName}" thành công`)
          handleRemoveOrder(sheetName);
        } catch (error) {
          console.error("Error sending data to server:", error);
        }  
    };

    return (
        <div>
            <h1>Add Order</h1>
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
            <div>
                {excelData && Object.keys(excelData).map((key, index) => (
                    <div key={key} className={styles['order-block']}>
                        <h3 style={{ color: 'blue' }}>Đơn hàng: {key}</h3>
                        <DisplayAddedOrders sheetName={key} order={excelData[key]} handleRemoveOrder={handleRemoveOrder} handleConfirmOrder={handleConfirmOrder}/>
                    </div>
                ))}
            </div>  

        </div>

    );
};

export default AddOrder;