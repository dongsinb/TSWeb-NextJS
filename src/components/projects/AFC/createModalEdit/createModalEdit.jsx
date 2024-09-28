import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import styles from "./cretateModalEdit.module.css";

const CreateModalEditAFC = ({ show, onHide, orderData, onSave }) => {
  // State to store the currently edited order data
  const [editedOrder, setEditedOrder] = useState(orderData || {});
  console.log("editedOrder:", JSON.stringify(editedOrder));

  // Update state when orderData prop changes
  useEffect(() => {
    setEditedOrder(orderData || {});
  }, [orderData]);

  // Function to update the order data in state
  const updateOrder = (orderKey, field, value) => {
    const newOrders = { ...editedOrder }; // Create a copy of editedOrder
    newOrders[orderKey][field] = parseInt(value, 10) || 0;

    setEditedOrder((prevOrder) => ({
      ...prevOrder,
      ...newOrders,
    }));
  };

  // Event handler for input changes
  const handleInputChange = (orderKey, field) => (event) => {
    const { value } = event.target; // Get the value from the input
    updateOrder(orderKey, field, value);
  };

  // Function to render table body rows
  const renderTableBody = () => {
    return Object.keys(editedOrder).map((orderKey) => {
      if (orderKey === "_id" || orderKey === "orderName") return null; // Skip the _id field
      const product = editedOrder[orderKey];
      return (
        <tr key={orderKey} className={styles.tableRow}>
          <td>{orderKey}</td>
          <td>
            <Form.Control
              type="number"
              value={product.ProductCount}
              onChange={handleInputChange(orderKey, "ProductCount")}
            />
          </td>
          <td>
            <Form.Control
              type="number"
              value={product.CurrentQuantity}
              onChange={handleInputChange(orderKey, "CurrentQuantity")}
            />
          </td>
        </tr>
      );
    });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Chỉnh sửa đơn hàng: {editedOrder.orderName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {Object.keys(editedOrder).length > 0 ? (
          <Table bordered hover>
            <thead>
              <tr>
                <th>Mã SP</th>
                <th>Số Lượng</th>
                <th>Số Lượng HT</th>
              </tr>
            </thead>
            <tbody>{renderTableBody()}</tbody>
          </Table>
        ) : (
          <p>Không có đơn hàng để chỉnh sửa.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            onSave(editedOrder);
            onHide();
          }}
        >
          Lưu thay đổi
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateModalEditAFC;
