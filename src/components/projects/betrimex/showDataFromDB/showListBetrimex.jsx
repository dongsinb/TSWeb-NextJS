import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import styles from "./showListBetrimex.module.css";
import AdvancedPagination from "../../../pagination/pagination";
import CreateModalEdit from "../../betrimex/UpdateData/createModalEdit";

function ShowListBetrimex(props) {
  const { data, reloadData } = props;
  const [itemUpdate, setItemUpdate] = useState(null);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Chỉ hiển thị 1 item mỗi trang

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
            <th>Thời gian</th>
            <th>Nhà cung cấp</th>
            <th>Mã lô</th>
            <th>Địa chỉ</th>
            <th>Số điện thoại</th>
            <th>Loại dừa</th>
            <th>Số lượng</th>
            <th>Hành động</th>
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
                    Chỉnh sửa
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <div className={styles.showPagination}>
        <AdvancedPagination
          totalItems={data.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          paginate={paginate}
        />
      </div>
      <CreateModalEdit
        showModalEdit={showModalCreate}
        setShowModalEdit={setShowModalCreate}
        itemUpdate={itemUpdate}
        reloadData={reloadData}
      />
    </div>
  );
}

export default ShowListBetrimex;
