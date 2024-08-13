import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import styles from "./showListBetrimex.module.css";
import AdvancedPagination from "../../../pagination/pagination";
import CreateModalEdit from "../../betrimex/UpdateData/createModalEdit";

function ShowListBetrimex({ data }) {
  const [itemUpdate, setItemUpdate] = useState(null);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Chỉ hiển thị 1 item mỗi trang

  // Lấy index của item đầu tiên và cuối cùng trong trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Lấy dữ liệu của trang hiện tại
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Thay đổi trang khi click vào pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <div className={styles.table_layout}>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Time</th>
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
          {currentItems.map((item, i) => {
            return (
              <tr className={styles.tableRow} key={i}>
                <td>{indexOfFirstItem + i + 1}</td>
                <td>{item.time}</td>
                <td>{item.supplier}</td>
                <td>{item.lotCode}</td>
                <td>{item.address}</td>
                <td>{item.phoneNumber}</td>
                <td>{item.coconutType}</td>
                <td>{item.quantity}</td>
                <td>
                  <Button
                    onClick={() => {
                      setShowModalCreate(true);
                      setItemUpdate(item);
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
      <AdvancedPagination
        totalItems={data.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        paginate={paginate}
      />
      <CreateModalEdit
        showModalEdit={showModalCreate}
        setShowModalEdit={setShowModalCreate}
        itemUpdate={itemUpdate}
      />
    </div>
  );
}

export default ShowListBetrimex;
