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
  const updateOrder = (orderKey, productKey, field, value) => {
    const newOrders = { ...editedOrder.Orders }; // Create a copy of Orders
    newOrders[orderKey][productKey][field] = parseInt(value, 10) || 0;

    setEditedOrder((prevOrder) => ({
      ...prevOrder,
      Orders: newOrders,
    }));
  };

  // Event handler for input changes
  const handleInputChange = (orderKey, productKey, field) => (event) => {
    const { value } = event.target; // Get the value from the input
    updateOrder(orderKey, productKey, field, value);
  };

  // Function to render table body rows
  const renderTableBody = () => {
    return Object.keys(editedOrder.Orders).map((orderKey) => {
      const products = editedOrder.Orders[orderKey];
      return Object.keys(products).map((productKey, productIndex) => {
        if (productKey === "_id") return null; // Skip the _id field
        const product = products[productKey];
        return (
          <tr
            key={`${orderKey}-${productKey}`}
            className={styles.tableRow}
          >
            {productIndex === 0 && (
              <td rowSpan={Object.keys(products).length - 1}>{orderKey}</td>
            )}
            <td>{productKey}</td>
            <td>
              <Form.Control
                type="number"
                value={product.ProductCount}
                onChange={handleInputChange(
                  orderKey,
                  productKey,
                  "ProductCount"
                )}
              />
            </td>
            <td>
              <Form.Control
                type="number"
                value={product.CurrentQuantity}
                onChange={handleInputChange(
                  orderKey,
                  productKey,
                  "CurrentQuantity"
                )}
              />
            </td>
          </tr>
        );
      });
    });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {editedOrder.Orders && Object.keys(editedOrder.Orders).length > 0 ? (
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
