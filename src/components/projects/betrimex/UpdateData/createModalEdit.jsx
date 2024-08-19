import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import styles from "./updateData.module.css";

function CreateModalEdit(props) {
  const { showModalEdit, setShowModalEdit, itemUpdate, reloadData } = props;

  const [lotCode, setLotCode] = useState("");
  const [supplier, setSupplier] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [coconutType, setCoconutType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [id, setID] = useState("");

  useEffect(() => {
    if (itemUpdate) {
      setLotCode(itemUpdate.lotCode);
      setSupplier(itemUpdate.supplier);
      setAddress(itemUpdate.address);
      setPhoneNumber(itemUpdate.phoneNumber);
      setCoconutType(itemUpdate.coconutType);
      setQuantity(itemUpdate.quantity);
      setID(itemUpdate._id);
    }
  }, [itemUpdate]);

  const updateData = async (data) => {
    const res = await fetch("http://localhost:5000/updateData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const isUpdate = await res.json();
    if (isUpdate) {
      reloadData();
    }
  };

  const handleSaveClick = () => {
    // const dataUpdate = {
    //   id,
    //   lotCode,
    //   supplier,
    //   address,
    //   phoneNumber,
    //   coconutType,
    //   quantity,
    // };
    // console.log("dataUpdate", dataUpdate);

    // setUpdateData({
    //   documentId: itemUpdate._id,
    //   updateFields: {
    //     address: itemUpdate.address,
    //     coconutType: itemUpdate.coconutType,
    //     quantity: itemUpdate.quantity,
    //     lotCode: itemUpdate.lotCode,
    //     phoneNumber: itemUpdate.phoneNumber,
    //     supplier: itemUpdate.supplier,
    //   },
    // });

    const data = {
      documentId: id,
      updateFields: {
        address: address,
        coconutType: coconutType,
        quantity: quantity,
        lotCode: lotCode,
        phoneNumber: phoneNumber,
        supplier: supplier,
      },
    };
    updateData(data);

    closeModal();
  };

  const closeModal = () => {
    setShowModalEdit(false);
  };

  return (
    <>
      <Modal
        show={showModalEdit}
        onHide={() => {
          setShowModalEdit(false);
        }}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
              <Form.Label className={styles.labelTitle}>Supplier</Form.Label>
              <Form.Control
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder=""
              />
            </Form.Group>
            <Form.Group className="mb-1" controlId="exampleForm.ControlInput2">
              <Form.Label className={styles.labelTitle}>Lot Code</Form.Label>
              <Form.Control
                value={lotCode}
                onChange={(e) => setLotCode(e.target.value)}
                placeholder=""
              />
            </Form.Group>
            <Form.Group className="mb-1" controlId="exampleForm.ControlInput3">
              <Form.Label className={styles.labelTitle}>Address</Form.Label>
              <Form.Control
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder=""
              />
            </Form.Group>
            <Form.Group className="mb-1" controlId="exampleForm.ControlInput4">
              <Form.Label className={styles.labelTitle}>
                Phone Number
              </Form.Label>
              <Form.Control
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder=""
              />
            </Form.Group>
            <Form.Group className="mb-1" controlId="exampleForm.ControlInput5">
              <Form.Label className={styles.labelTitle}>Type</Form.Label>
              <Form.Control
                value={coconutType}
                onChange={(e) => setCoconutType(e.target.value)}
                placeholder=""
              />
            </Form.Group>
            <Form.Group className="mb-1" controlId="exampleForm.ControlInput6">
              <Form.Label className={styles.labelTitle}>Quantity</Form.Label>
              <Form.Control
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder=""
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModalEdit(false);
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleSaveClick();
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateModalEdit;
