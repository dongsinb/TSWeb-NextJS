"use client";
import React, { useState } from "react";
import styles from "./showOrders.module.css";
import { Table, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import AdvancedPagination from "../../../pagination/pagination";

function ShowOrders(props) {
  const { datas } = props;
  const router = useRouter();
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const handleCallOrder = (data) => {
    alert(`Called for item with _id: ${data._id}`);
    console.log("dataSend: ", data);
    localStorage.setItem("orderData", JSON.stringify(data));
    router.push("/home/countingAFC");
  };

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Chỉ hiển thị 1 item mỗi trang

  // Lấy index của item đầu tiên và cuối cùng trong trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Lấy dữ liệu của trang hiện tại
  const currentItems = datas.slice(indexOfFirstItem, indexOfLastItem);

  // Thay đổi trang khi click vào pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={styles.table_layout}>
      <Table striped bordered hover>
        <thead>
          <tr className={styles.tableRow}>
            <th>STT</th>
            <th>Ngày vào</th>
            <th>Biển số xe</th>
            <th>Trạng thái</th>
            <th>Đơn hàng</th>
            <th>Gọi vào kho</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((data, i) => (
            <tr key={data._id} className={styles.tableRow}>
              <td>{indexOfFirstItem + i + 1}</td>
              <td>{data.date}</td>
              <td>{data.license_plate}</td>
              <td>{data.status}</td>
              <td>
                <Button onClick={() => toggleRow(i)}>
                  {expandedRow === i ? "Ẩn" : "Hiển thị chi tiết"}
                </Button>
                {expandedRow === i && (
                  <div className={styles.details}>
                    <Table bordered size="sm" className={styles.ordersTable}>
                      <thead>
                        <tr>
                          <th>Order</th>
                          <th>Item</th>
                          <th>Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(data.orderslist).map(
                          ([orderName, items]) => {
                            const itemEntries = Object.entries(items);
                            return itemEntries.map(
                              ([item, quantity], index) => (
                                <tr
                                  key={`${orderName}-${item}`}
                                  className={styles.tableRow}
                                >
                                  {index === 0 && (
                                    <td rowSpan={itemEntries.length}>
                                      {orderName}
                                    </td>
                                  )}
                                  <td>{item}</td>
                                  <td>{quantity}</td>
                                </tr>
                              )
                            );
                          }
                        )}
                      </tbody>
                    </Table>
                  </div>
                )}
              </td>
              <td>
                <Button onClick={() => handleCallOrder(data)}>
                  Gọi vào kho
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className={styles.showPagination}>
        <AdvancedPagination
          totalItems={datas.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          paginate={paginate}
        />
      </div>
    </div>
  );
}

export default ShowOrders;
