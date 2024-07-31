import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import styles from "./showListBetrimex.module.css";
import CreateModalEdit from "@/components/projects/betrimex/showDataFromDB/createModalEdit";

function ShowListBetrimex({ data }) {
  console.log("data from DB: ", data);
  const [showModalCreate, setShowModalCreate] = useState(false);
  return (
    <div className={styles.table_layout}>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Supplier</th>
            <th>Lot code</th>
            <th>Address</th>
            <th>Phone Number</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => {
            return (
              <tr className={styles.tableRow}>
                <td>{i}</td>
                <td>{item.supplier}</td>
                <td>{item.lotCode}</td>
                <td>{item.address}</td>
                <td>{item.phoneNumber}</td>
                <td>{item.coconutType}</td>
                <td>{item.count}</td>
                <td>
                  <Button
                    onClick={() => {
                      setShowModalCreate(true);
                    }}
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <CreateModalEdit
        showModalEdit={showModalCreate}
        setShowModalEdit={setShowModalCreate}
      />
    </div>
  );
}

export default ShowListBetrimex;
