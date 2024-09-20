"use client";
import React, { useState } from "react";
import styles from "./showOrders.module.css";
import { Table, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import AdvancedPagination from "../../../pagination/pagination";
import CreateModeCall from "../createModalCall/createModalCall";
import { FaEdit } from "react-icons/fa";
import CreateModalEditAFC from "../createModalEdit/createModalEdit";

function ShowOrders(props) {
  const { datas, status } = props;
  console.log("show Oder datas: ", datas);
  const router = useRouter();
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const [showModalCall, setShowModalCall] = useState(false);
  const [calledOrder, setCallOrder] = useState(null);

  const [confirmOrder, setConfirmOrder] = useState(null);

  const handleCallOrder = (data) => {
    // alert(`Called for item with _id: ${data._id}`);
    setShowModalCall(true);
    setCallOrder(data);

    console.log("dataSend: ", JSON.stringify(data));
    // localStorage.setItem("orderData", JSON.stringify(data));
    // localStorage.setItem("confirmOrder", JSON.stringify(confirmOrder));
    // setCallOrder(data);
    // router.push("/home/countingAFC");
  };

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Chỉ hiển thị 1 item mỗi trang

  // Lấy index của item đầu tiên và cuối cùng trong trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Lấy dữ liệu của trang hiện tại
  const currentItems = datas.slice(indexOfFirstItem, indexOfLastItem);

  // Thay đổi trang khi click vào pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Edit click
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setShowModalEdit(true);
  };

  const handleSaveOrder = (updatedOrder) => {
    // Handle saving the updated order here
    console.log("Updated Order:", updatedOrder);
    // Optionally, update the orders list in your state or make an API call to save the changes
  };

  return (
    <div className={styles.table_layout}>
      <Table striped bordered hover>
        <thead>
          <tr className={styles.tableRow}>
            <th>STT</th>
            <th>Ngày vào</th>
            <th>Biển số xe</th>
            <th>Trạng thái</th>
            <th>Đơn hàng</th>
            {status !== "Called" && status !== "Finished" && (
              <th>Gọi vào kho</th>
            )}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((data, i) => (
            <tr key={`${data.PlateNumber}-${i}`} className={styles.tableRow}>
              <td>{indexOfFirstItem + i + 1}</td>
              <td>{data.DateTimeIn}</td>
              <td>{data.PlateNumber}</td>
              <td>{data.Status}</td>
              <td>
                <Button onClick={() => toggleRow(i)}>
                  {expandedRow === i ? "Ẩn" : "Hiển thị chi tiết"}
                </Button>
                {expandedRow === i && (
                  <div className={styles.details}>
                    <Table bordered size="sm" className={styles.ordersTable}>
                      <thead>
                        <tr>
                          <th>
                            <p className="mb-0">Đơn hàng</p>
                            <FaEdit
                              className={styles.editIcon}
                              onClick={() => handleEditOrder(data)}
                            />
                          </th>
                          <th>Mã SP</th>
                          <th>Số Lượng</th>
                          <th>Số Lượng HT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(data.Orders).map(([orderName, items]) => (
                          Object.entries(items).map(([productCode, item], itemIndex) => (
                            <tr
                              key={`${data._id}-${orderName}-${productCode}-${itemIndex}`}
                              className={styles.tableRow}
                            >
                              {itemIndex === 0 && (
                                <td rowSpan={Object.keys(items).length}>
                                  <p>{orderName}</p>
                                </td>
                              )}
                              {productCode !== "_id" && (
                                <>
                                  <td>{productCode}</td>
                                  <td>{item.ProductCount}</td>
                                  <td>{item.CurrentQuantity}</td>
                                </>
                              )}
                            </tr>
                          ))
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </td>
              {status !== "Called" && status !== "Finished" && (
                <td>
                  <Button onClick={() => handleCallOrder(data)}>
                    Gọi vào kho
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
      <div className={styles.showPagination}>
        <AdvancedPagination
          totalItems={datas.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          paginate={paginate}
        />
      </div>
      <CreateModeCall
        showModalCall={showModalCall}
        setShowModalCall={setShowModalCall}
        calledOrder={calledOrder}
        setConfirmOrder={setConfirmOrder}
      />
      <CreateModalEditAFC
        show={showModalEdit}
        onHide={() => setShowModalEdit(false)}
        orderData={selectedOrder}
        onSave={handleSaveOrder}
      />
    </div>
  );
}

export default ShowOrders;
