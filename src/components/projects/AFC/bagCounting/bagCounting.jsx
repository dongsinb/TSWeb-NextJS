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
            <td colSpan="3">
              <strong>Status:</strong> {data.status}
            </td>
          </tr>
          <tr className={styles.tableRow}>
            <td colSpan="3">
              <strong>License Plate:</strong> {data.license_plate}
            </td>
          </tr>
          <tr className={styles.tableRow}>
            <th>Order</th>
            <th>Item</th>
            <th>Quantity</th>
          </tr>
          {/* Hiển thị các đơn hàng */}
          {Object.entries(data.orderslist).map(([orderName, items]) => {
            const itemEntries = Object.entries(items);
            return itemEntries.map(([item, quantity], index) => (
              <tr key={`${orderName}-${item}`} className={styles.tableRow}>
                {index === 0 && (
                  <td rowSpan={itemEntries.length}>{orderName}</td>
                )}
                <td>{item}</td>
                <td>{quantity}</td>
              </tr>
            ));
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default BagCounting;
