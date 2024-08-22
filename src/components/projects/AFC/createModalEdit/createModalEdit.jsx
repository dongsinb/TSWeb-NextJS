import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
// import styles from "./createModalEdit.module.css";

const CreateModalEditAFC = ({ show, onHide, orderData, onSave }) => {
  const [editedOrder, setEditedOrder] = useState(orderData || {});

  useEffect(() => {
    setEditedOrder(orderData || {});
  }, [orderData]);

  const handleInputChange = (orderName, itemName, event) => {
    const { value } = event.target;
    const integerValue = parseInt(value, 10) || 0;
    setEditedOrder((prevOrder) => ({
      ...prevOrder,
      orderslist: {
        ...prevOrder.orderslist,
        [orderName]: {
          ...prevOrder.orderslist[orderName],
          [itemName]: integerValue,
        },
      },
    }));
  };

  const handleSave = () => {
    onSave(editedOrder);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {editedOrder.orderslist &&
        Object.keys(editedOrder.orderslist).length > 0 ? (
          <Table bordered hover>
            <thead>
              <tr>
                <th>Order</th>
                <th>Item</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(editedOrder.orderslist).map(
                ([orderName, items]) => {
                  const itemEntries = Object.entries(items);
                  return itemEntries.map(([item, quantity], index) => (
                    <tr key={`${orderName}-${item}`}>
                      {index === 0 && (
                        <td rowSpan={itemEntries.length}>{orderName}</td>
                      )}
                      <td>{item}</td>
                      <td>
                        <Form.Control
                          type="number"
                          value={quantity}
                          onChange={(e) =>
                            handleInputChange(orderName, item, e)
                          }
                        />
                      </td>
                    </tr>
                  ));
                }
              )}
            </tbody>
          </Table>
        ) : (
          <p>No orders to edit.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateModalEditAFC;
