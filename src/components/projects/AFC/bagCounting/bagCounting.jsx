import React from "react";
import { Table } from "react-bootstrap";
import styles from "./bagCounting.module.css";

const BagCounting = (props) => {
  const { data } = props;
  return (
    <div>
      <Table striped bordered hover>
        <tbody>
          {/* Hiển thị status và license plate */}
          <tr className={styles.tableRow}>
            <td colSpan="4">
              <strong>Status:</strong> {data.status}
            </td>
          </tr>
          <tr className={styles.tableRow}>
            <td colSpan="4">
              <strong>License Plate:</strong> {data.PlateNumber}
            </td>
          </tr>
          <tr className={styles.tableRow}>
            <th>Đơn Hàng</th>
            <th>Sản phẩm</th>
            <th>Số lượng</th>
            <th>Số lượng HT</th>
          </tr>
          {/* Hiển thị các đơn hàng */}
          {data.Orders.map((order, orderIndex) => {
            const [orderName, items] = Object.entries(order)[0];
            // Render
            return items.map((item, itemIndex) => (
              <tr
                key={`${orderName}-${item.ProductCode}`}
                className={styles.tableRow}
              >
                {itemIndex === 0 && (
                  <td rowSpan={items.length}>
                    <p>{orderName}</p>
                  </td>
                )}
                <td>{item.ProductCode}</td>
                <td>{item.ProductCount}</td>
                <td>{item.CurrentQuantity}</td>
              </tr>
            ));
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default BagCounting;
