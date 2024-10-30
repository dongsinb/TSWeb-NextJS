"use client";
import React, { useEffect, useRef, useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import BagCounting from "../bagCounting/bagCounting";
import axios from "axios";
import NProgress from "../../../loadingBar/nprogress-config";
import config from "../../../../app/config";
import { AiFillBell } from "react-icons/ai";
import styles from "./homeAfc.module.css";
import HandleNGModal from "./handleNGModal/handleNGModal";

const AFCHome = () => {
  const [data, setData] = useState({});
  const [showAllOrder, setShowAllOrder] = useState(true);
  const [allOrder, setAllOrder] = useState([{}, {}, {}, {}, {}]);
  const [selectedOrder, setSelectedOrder] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [currentBell, setCurrentBell] = useState(null);
  const [showHandleNGModal, setShowHandleNGModal] = useState(false);
  const [confirmAll, setConfirmAll] = useState(false);
  //   let allOrder = {};
  const alertSound = useRef(null);

  useEffect(() => {
    console.log("test load audio first");
    alertSound.current = new Audio(`/audios/alert.mp3`);
    alertSound.current.load(); // Tải âm thanh trước
  }, []);

  const handleShak = () => {
    if (isShaking) {
      setShowHandleNGModal(true);
    }
  };

  const handleSelectChange = (event) => {
    setSelectedOrder(event.target.selectedIndex);
    console.log("Chỉ số đơn hàng đã chọn:", event.target.selectedIndex);
  };

  // Hàm xác nhận (đóng modal và dừng rung)
  const handleConfirm = () => {
    setIsShaking(false);
    setShowHandleNGModal(false);
    setConfirmAll(true);
  };

  // Hàm kiểm tra trạng thái lỗi
  function checkErrorStatus(data) {
    for (const line in data) {
      if (data[line].IsError === true) {
        setIsShaking(true);

        // const timeoutId = setTimeout(() => {
        //   if (isShaking) {
        //     console.log("auto confrim");
        //     // handleConfirm();
        //   }
        // }, 10000); // 100 giây

        return true;
      }
    }
    return false;
  }

  //   useEffect(() => {
  //     if (isShaking) {
  //       const timeoutId = setTimeout(() => {
  //         if (isShaking) {
  //           // Kiểm tra qua tham chiếu thay vì state
  //           console.log("auto confirm");
  //           setShowHandleNGModal(true);
  //           setConfirmAll(true);
  //         }
  //       }, 20000); // 10 giây

  //       // Dọn dẹp timeout nếu isShaking thay đổi hoặc component bị hủy
  //       return () => clearTimeout(timeoutId);
  //     }
  //   }, [isShaking]);

  useEffect(() => {
    if (isShaking) {
      console.log("audio played");
      alertSound.current.play().catch((err) => {
        console.error("Error playing alert sound:", err);
      });
      alertSound.current.loop = true;
      const timeoutId = setTimeout(() => {
        if (isShaking) {
          // Kiểm tra qua tham chiếu thay vì state
          console.log("auto confirm");
          setShowHandleNGModal(true);
          setConfirmAll(true);
        }
      }, 500000); // 10 giây
      return () => clearTimeout(timeoutId);
    } else if (alertSound.current) {
      alertSound.current.pause();
      alertSound.current.currentTime = 0;
    }
    return () => {
      if (alertSound.current) {
        alertSound.current.pause();
        alertSound.current.currentTime = 0;
      }
    };
  }, [isShaking]);

  //   useEffect(() => {
  //     if (isShaking && alertSound.current) {
  //       console.log("audio played");
  //       alertSound.current.play().catch((err) => {
  //         console.error("Error playing alert sound:", err);
  //       });
  //       alertSound.current.loop = true;
  //     } else if (alertSound.current) {
  //       alertSound.current.pause();
  //       alertSound.current.currentTime = 0;
  //     }
  //     return () => {
  //       if (alertSound.current) {
  //         alertSound.current.pause();
  //         alertSound.current.currentTime = 0;
  //       }
  //     };
  //   }, [isShaking]);

  // Lấy dữ liệu từ API và kiểm tra lỗi
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${config.API_BASE_URL}/getCountingData`
        );
        const data = response.data;
        const result = [];
        const lines = Object.keys(data);

        for (const line of lines) {
          if (data[line] && Object.keys(data[line]).length > 0) {
            result.push({ ...data[line], Line: line });
          } else {
            result.push(data[line]);
          }
        }

        setAllOrder(result);
        checkErrorStatus(data); // Kiểm tra trạng thái lỗi
      } catch (error) {
        console.error("Error fetching data:", error);
        setData({});
        setAllOrder([{}, {}, {}, {}, {}]);
        NProgress.done();
      }
    };

    fetchData(); // Fetch lần đầu
    const intervalId = setInterval(fetchData, 1000); // Fetch lại mỗi giây

    return () => clearInterval(intervalId); // Cleanup khi component unmount
  }, []);

  const dataTestNoCombine_old = {
    DateTimeIn: "2024-09-16T07:00:00.000+07:00",
    IsCombine: false,
    Orders: [
      {
        Test0061486509: [
          { CurrentQuantity: 0, ProductCode: "9090-05", ProductCount: 10 },
          { CurrentQuantity: 0, ProductCode: "GO2-25", ProductCount: 20 },
        ],
      },
      {
        "0061486509": [
          { CurrentQuantity: 0, ProductCode: "1000-05", ProductCount: 1 },
          { CurrentQuantity: 0, ProductCode: "W100S-25", ProductCount: 2 },
          { CurrentQuantity: 0, ProductCode: "1020-25", ProductCount: 120 },
          { CurrentQuantity: 0, ProductCode: "3020-25", ProductCount: 120 },
          { CurrentQuantity: 0, ProductCode: "CA02-25-30", ProductCount: 5 },
          { CurrentQuantity: 0, ProductCode: "1050-25", ProductCount: 7 },
        ],
      },
    ],
    PlateNumber: "34C09690",
    SortList: ["Test0061486509", "0061486509"],
    _id: "66e79c8aa7ec9f3c82288464",
  };

  const dataTestCombine = {
    DateTimeIn: "2024-09-16T07:00:00.000+07:00",
    IsCombine: true,
    Orders: [
      {
        order: [
          { CurrentQuantity: 0, ProductCode: "1000-05", ProductCount: 1 },
          { CurrentQuantity: 0, ProductCode: "W100S-25", ProductCount: 2 },
          { CurrentQuantity: 0, ProductCode: "1020-25", ProductCount: 120 },
          { CurrentQuantity: 0, ProductCode: "3020-25", ProductCount: 120 },
          { CurrentQuantity: 0, ProductCode: "CA02-25-30", ProductCount: 5 },
          { CurrentQuantity: 0, ProductCode: "1050-25", ProductCount: 7 },
          { CurrentQuantity: 0, ProductCode: "9090-05", ProductCount: 10 },
          { CurrentQuantity: 0, ProductCode: "GO2-25", ProductCount: 20 },
        ],
      },
    ],
    PlateNumber: "34C09690",
    SortList: ["Test0061486509", "0061486509"],
    _id: "66e79c8aa7ec9f3c82288464",
  };

  const dataTestNoCombine_new = {
    DateTimeIn: "2024-06-12T00:00:00+07:00",
    IsCombine: false,
    Orders: {
      "0041478858": {
        "111G-25": { CurrentQuantity: 0, ProductCount: 25 },
        "112S-25": { CurrentQuantity: 0, ProductCount: 25 },
        "122G-25": { CurrentQuantity: 0, ProductCount: 25 },
        "2220-25": { CurrentQuantity: 0, ProductCount: 25 },
        _id: "66e940e4a56399da40148afa",
      },
      "0051478858": {
        "111G-25": { CurrentQuantity: 0, ProductCount: 25 },
        "121G-25": { CurrentQuantity: 0, ProductCount: 25 },
        "212S-25": { CurrentQuantity: 0, ProductCount: 25 },
        "2220-25": { CurrentQuantity: 0, ProductCount: 25 },
        _id: "66e9411fa56399da40148afb",
      },
      Test1: {
        "111G-25": { CurrentQuantity: 0, ProductCount: 25 },
        "121G-25": { CurrentQuantity: 0, ProductCount: 25 },
        "2220-25": { CurrentQuantity: 0, ProductCount: 25 },
        _id: "66e9411fa56399da40148afb",
      },
      Test2: {
        "111G-25": { CurrentQuantity: 0, ProductCount: 25 },
        "121G-25": { CurrentQuantity: 0, ProductCount: 25 },
        "212S-25": { CurrentQuantity: 0, ProductCount: 25 },
        "2220-25": { CurrentQuantity: 0, ProductCount: 25 },
        _id: "66e9411fa56399da40148afb",
      },
    },
    PlateNumber: "19C19248",
    SortList: ["0051478858", "0041478858", "Test1", "Test2"],
    isAllOrderFull: true,
  };
  //   allOrder = [
  //     dataTestNoCombine_new,
  //     {},
  //     {},
  //     dataTestNoCombine_new,
  //     dataTestNoCombine_new,
  //   ];
  const dataTestCombine_new = {
    DateTimeIn: "2024-06-12T00:00:00+07:00",
    IsCombine: true,
    Orders: {
      ordername: {
        "111G-25": {
          CurrentQuantity: 0,
          ProductCount: 50,
        },
        "112S-25": {
          CurrentQuantity: 0,
          ProductCount: 25,
        },
        "121G-25": {
          CurrentQuantity: 0,
          ProductCount: 25,
        },
        "122G-25": {
          CurrentQuantity: 0,
          ProductCount: 25,
        },
        "212S-25": {
          CurrentQuantity: 0,
          ProductCount: 25,
        },
        "2220-25": {
          CurrentQuantity: 0,
          ProductCount: 50,
        },
      },
    },
    PlateNumber: "19C19248",
    SortList: ["0051478858", "0041478858"],
  };
  // data = { ...dataTestNoCombine_new };

  const handleRefreshCountingData = (index) => {
    const refreshCountingData = async (index) => {
      try {
        NProgress.start();
        alert(index);
        const lineSelected = `Line${index + 1}`;
        const response = await axios.post(
          `${config.API_BASE_URL}/refreshData`,
          {
            Line: lineSelected,
          }
        );
        console.log("response.data", response.data);
        setData(response.data);
        NProgress.done();
      } catch (error) {
        console.error("Error refreshing data:", error);
        NProgress.done();
      } finally {
        NProgress.done();
      }
    };

    refreshCountingData(index);
  };

  const handleResetCountingData = (index) => {
    const resetCountingData = async (index) => {
      try {
        NProgress.start();
        const lineSelected = `Line${index + 1}`;
        const response = await axios.post(
          `${config.API_BASE_URL}/resetCountingData`,
          {
            Line: lineSelected,
          }
        );
        console.log("response.data", response.data);
        setData(response.data);
        NProgress.done();
      } catch (error) {
        console.error("Error refreshing data:", error);
        NProgress.done();
      } finally {
        NProgress.done();
      }
    };
    const confirmReset = confirm(
      `Bạn chắc chắn muốn xóa đơn hàng ở cổng số ${index + 1}?`
    );
    if (confirmReset) {
      resetCountingData(index);
    } else {
      console.log("Không xóa đơn hàng");
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          justifyContent: "space-between",
          //   height: "100%",
        }}
      >
        <div style={{ height: "100%" }}>
          <Button
            variant="outline-primary"
            onClick={() => setShowAllOrder(false)}
            style={{
              marginBottom: "10px",
              marginRight: "10px",
              backgroundColor: showAllOrder ? "transparent" : "#007bff",
              color: showAllOrder ? "#007bff" : "white",
            }}
          >
            Hiển thị 1 đơn hàng
          </Button>
          <Button
            variant="outline-primary"
            onClick={() => setShowAllOrder(true)}
            style={{
              marginBottom: "10px",
              marginRight: "10px",
              backgroundColor: showAllOrder ? "#007bff" : "transparent",
              color: showAllOrder ? "white" : "#007bff",
            }}
          >
            Hiển thị 5 đơn hàng
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "50px", // Chiều cao cố định cho cha
            gap: "10px", // Khoảng cách giữa các phần tử
          }}
        >
          {showAllOrder ? (
            <div style={{ visibility: "hidden" }}></div>
          ) : (
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                height: "100%",
              }}
            >
              {/* <Button
                variant="outline-info"
                onClick={() => handleRefreshCountingData(selectedOrder)}
                style={{
                  height: "40px",
                  width: "200px",
                }}
              >
                Làm mới đơn hàng
              </Button> */}

              <Form.Select
                aria-label="Chọn đơn hàng số"
                style={{
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  width: "200px",
                }}
                onChange={handleSelectChange}
              >
                <option value="1">Đơn hàng 1</option>
                <option value="2">Đơn hàng 2</option>
                <option value="3">Đơn hàng 3</option>
                <option value="4">Đơn hàng 4</option>
                <option value="5">Đơn hàng 5</option>
              </Form.Select>
            </div>
          )}

          <AiFillBell
            style={{
              color: "white",
              fontSize: "40px",
              cursor: "pointer",
              height: "40px", // Chiều cao đồng nhất với các phần tử khác
              display: "flex",
              alignItems: "center", // Căn giữa biểu tượng chuông
            }}
            className={isShaking ? styles.bellShake : ""}
            onClick={() => handleShak()}
          />
        </div>
      </div>
      <div>
        {showAllOrder === false ? (
          allOrder[selectedOrder] &&
          Object.keys(allOrder[selectedOrder]).length === 0 ? (
            <div>
              <Card className="text-center" style={{ marginTop: "20px" }}>
                <Card.Body>
                  <Card.Title>OrderName: {selectedOrder + 1}</Card.Title>
                  <Card.Title>Không có dữ liệu</Card.Title>
                  <Card.Text>Chưa có đơn hàng được gọi</Card.Text>
                </Card.Body>
              </Card>
            </div>
          ) : (
            <div>
              <BagCounting counting_data={allOrder[selectedOrder]} />
            </div>
          )
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              height: "calc(100vh - 180px)",
            }}
          >
            {allOrder.map((order, index) =>
              order && Object.keys(order).length === 0 ? (
                <div key={index} style={{ display: "none" }}>
                  Không có dữ liệu
                </div>
              ) : (
                // <div key={index}>
                //   <div
                //     style={{
                //       display: "flex",
                //       justifyContent: "center",
                //       marginBottom: "10px",
                //       alignItems: "center",
                //     }}
                //   >
                //     <AiFillBell
                //       style={{
                //         marginRight: "8px",
                //         color: "white",
                //         fontSize: "40px",
                //       }}
                //       className={isShaking[index] ? styles.bellShake : ""}
                //       onClick={() => handleShak(index)}
                //     />
                //     <Button
                //       variant="outline-info"
                //       onClick={handleRefreshCountingData}
                //     >
                //       Làm mới đơn hàng
                //     </Button>
                //   </div>
                //   <Card
                //     key={index}
                //     className="text-center"
                //     style={{
                //       marginTop: "0px",
                //       flex: "1 1 20%",
                //       overflowY: "auto",
                //     }}
                //   >
                //     <Card.Body>
                //       <Card.Title>OrderName: {index + 1}</Card.Title>
                //       <Card.Title>Không có dữ liệu</Card.Title>
                //       <Card.Text>Chưa có đơn hàng được gọi</Card.Text>
                //     </Card.Body>
                //   </Card>
                // </div>
                <div key={index}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      marginBottom: "10px",
                      alignItems: "center",
                    }}
                  >
                    {/* <Button
                      variant="outline-info"
                      onClick={() => {
                        handleRefreshCountingData(index);
                      }}
                    >
                      Làm mới đơn hàng
                    </Button> */}
                    {/* <Button
                      variant="outline-danger"
                      onClick={() => {
                        handleResetCountingData(index);
                      }}
                    >
                      Xóa đơn hàng
                    </Button> */}
                  </div>
                  <BagCounting counting_data={order} />
                </div>
              )
            )}
          </div>
        )}
      </div>
      <HandleNGModal
        show={showHandleNGModal}
        setShow={setShowHandleNGModal}
        handleConfirm={handleConfirm}
        confirmAll={confirmAll}
        setConfirmAll={setConfirmAll}
        setIsShaking={setIsShaking}
      />
    </div>
  );
};

export default AFCHome;
