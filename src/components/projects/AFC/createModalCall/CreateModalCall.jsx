"use client";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styles from "./createModalCall.module.css";
import axios from "axios";

function CreateModalCall(props) {
  const { showModalCall, setShowModalCall, calledOrder, setConfirmOrder } =
    props;
  const handleClose = () => {
    setShowModalCall(false);
    setIsChecked(false);
  };
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const [ordersList, setOrdersList] = useState([]);

  useEffect(() => {
    if (calledOrder && calledOrder["Orders"]) {
      const orders = calledOrder["Orders"].map(
        (order) => Object.keys(order)[0]
      );
      setOrdersList(orders);
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

  const sendConfirmOrder = async (confirmOrderinfo) => {
    try {
      const response = await axios.post(
        "http://192.168.100.134:5000/countingData",
        confirmOrderinfo
      );
      console.log("Success:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const confirmOrder = () => {
    // Tạo danh sách các đơn hàng đã sắp xếp lại
    console.log("ordersList: ", ordersList);
    // const sortedOrders = ordersList.map((orderName) => {
    //   return {
    //     [orderName]: calledOrder["Orders"][orderName],
    //   };
    // });

    // const confirmOrderinfo = {
    //   ...calledOrder,
    //   isCombine: isChecked,
    //   sortList: sortedOrders,
    // };
    const confirmOrderinfo = {
      PlateNumber: calledOrder.PlateNumber,
      DateTimeIn: calledOrder.DateTimeIn,
      Status: calledOrder.Status,
      IsCombine: isChecked,
      SortList: ordersList,
    };

    sendConfirmOrder(confirmOrderinfo);
    setConfirmOrder(confirmOrderinfo);
    console.log("ordersList: ", ordersList);
    console.log("confirmOrderinfo: ", JSON.stringify(confirmOrderinfo));
    handleClose();
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
                {ordersList.map((orderName, index) => (
                  <Draggable
                    key={orderName}
                    draggableId={orderName}
                    index={index}
                  >
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
                        {orderName}
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
