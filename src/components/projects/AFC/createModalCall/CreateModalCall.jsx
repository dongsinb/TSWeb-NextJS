"use client";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styles from "./createModalCall.module.css";

function CreateModalCall(props) {
  const { showModalCall, setShowModalCall, calledOrder, setConfirmOrder } =
    props;
  const handleClose = () => setShowModalCall(false);
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const [ordersList, setOrdersList] = useState([]);

  useEffect(() => {
    if (calledOrder && calledOrder["orderslist"]) {
      setOrdersList(Object.keys(calledOrder["orderslist"]));
    } else {
      setOrdersList([]);
    }
  }, [calledOrder]);

  const handleOnDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination || destination.index === source.index) return;

    const reorderedList = Array.from(ordersList);
    const [movedItem] = reorderedList.splice(source.index, 1);
    reorderedList.splice(destination.index, 0, movedItem);
    setOrdersList(reorderedList);
  };

  useEffect(() => {
    if (isChecked) {
      console.log("Checkbox is checked");
    } else {
      console.log("Checkbox is unchecked");
    }
  }, [isChecked]);

  const confirmOrder = () => {
    const confirmOrderinfo = Object.assign({}, calledOrder, {
      isCombine: isChecked,
      sortList: ordersList,
    });
    setConfirmOrder(confirmOrderinfo);
    console.log("confirmOrderinfo: ", confirmOrderinfo);
    console.log("ordersList: ", ordersList);
    setShowModalCall(false);
    console.log("confirmOrderinfo: ", confirmOrderinfo);
    localStorage.setItem("orderData", JSON.stringify(calledOrder));
    localStorage.setItem("confirmOrder", JSON.stringify(confirmOrderinfo));
  };

  return (
    <Modal
      show={showModalCall}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Gọi đơn</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.ModalBody}>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {ordersList.map((item, index) => (
                  <Draggable key={item} draggableId={item} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          padding: "8px",
                          margin: "4px",
                          border: "1px solid lightgrey",
                          borderRadius: "4px",
                          backgroundColor: "rgba(0, 0, 255, 0.5)",
                          color: "black",
                          textAlign: "center",
                        }}
                      >
                        {item}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div className="mb-3">
          <Form.Check
            type="checkbox"
            id="default-checkbox"
            label="Gộp đơn hàng"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={confirmOrder}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateModalCall;