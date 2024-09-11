import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import styles from "./cretateModalEdit.module.css";

const CreateModalEditAFC = ({ show, onHide, orderData, onSave }) => {
  // State to store the currently edited order data
  const [editedOrder, setEditedOrder] = useState(orderData || {});

  // Update state when orderData prop changes
  useEffect(() => {
    setEditedOrder(orderData || {});
  }, [orderData]);

  // Function to update the order data in state
  const updateOrder = (orderIndex, productIndex, field, value) => {
    const newOrders = [...editedOrder.Orders]; // Create a copy of Orders
    newOrders[orderIndex][Object.keys(newOrders[orderIndex])[0]][productIndex][
      field
    ] = parseInt(value, 10) || 0;

    setEditedOrder((prevOrder) => ({
      ...prevOrder,
      Orders: newOrders,
    }));
  };

  // Event handler for input changes
  const handleInputChange = (orderIndex, productIndex, field) => (event) => {
    const { value } = event.target; // Get the value from the input
    updateOrder(orderIndex, productIndex, field, value);
  };

  // Function to render table body rows
  const renderTableBody = () => {
    return editedOrder.Orders.map((order, orderIndex) => {
      const orderKey = Object.keys(order)[0]; // Get the order name (e.g., Order1)
      return order[orderKey].map((product, productIndex) => (
        <tr
          key={`${orderKey}-${product.ProductCode}`}
          className={styles.tableRow}
        >
          {productIndex === 0 && (
            <td rowSpan={order[orderKey].length}>{orderKey}</td>
          )}
          <td>{product.ProductCode}</td>
          <td>
            <Form.Control
              type="number"
              value={product.ProductCount}
              onChange={handleInputChange(
                orderIndex,
                productIndex,
                "ProductCount"
              )}
            />
          </td>
          <td>
            <Form.Control
              type="number"
              value={product.CurrentQuantity}
              onChange={handleInputChange(
                orderIndex,
                productIndex,
                "CurrentQuantity"
              )}
            />
          </td>
        </tr>
      ));
    });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {editedOrder.Orders && editedOrder.Orders.length > 0 ? (
          <Table bordered hover>
            <thead>
              <tr>
                <th>Order</th>
                <th>Product Code</th>
                <th>Product Count</th>
                <th>Current Quantity</th>
              </tr>
            </thead>
            <tbody>{renderTableBody()}</tbody>
          </Table>
        ) : (
          <p>No orders to edit.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            onSave(editedOrder);
            onHide();
          }}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateModalEditAFC;
