"use client";
import React, { useEffect, useState } from "react";
import { Card, Alert, Button, InputGroup, Form } from "react-bootstrap";
import BagCounting from "../bagCounting/bagCounting";
import axios, { all } from "axios";
import NProgress from "../../../loadingBar/nprogress-config";
import config from "../../../../app/config"
import { AiFillBell } from 'react-icons/ai';
import styles from "./homeAfc.module.css"

const AFCHome = () => {
  const [data, setData] = useState({});
  const [showAllOrder, setShowAllOrder] = useState(false); 
  // const [allOrder, setAllOrder] = useState([{}, {}, {}, {}, {}]);  
  const [selectedOrder, setSelectedOrder] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  // const [alertSound] = useState(new Audio('/audios/alert.mp3'));
  const handleShak = () => {
    const hasErrors = false; 
    if (hasErrors) {
      alert("Có lỗi xảy ra!");
    }
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 1000);
  }

  const handleSelectChange = (event) => {
    setSelectedOrder(event.target.selectedIndex);
    console.log("Chỉ số đơn hàng đã chọn:", event.target.selectedIndex);
  };

  useEffect(() => {
    const alertSound = new Audio('/audios/Line1.mp3')
    if (isShaking) {
      console.log('play');
      alertSound.loop = true;
      alertSound.play();
    } else {
      console.log('pause');
      alertSound.pause();
      alertSound.currentTime = 0; // Reset the sound
    }

    // Cleanup function để dừng âm thanh khi component unmount hoặc trạng thái thay đổi
    return () => {
      alertSound.pause();
      alertSound.currentTime = 0;
    };
  }, [isShaking]);


  let allOrder = {};

  useEffect(() => {
    if (showAllOrder) {
      console.log("Đang hiển thị tất cả đơn hàng");
    } else {
      console.log("Đang hiển thị một đơn hàng");
    }
  }, [showAllOrder]);

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
        _id: "66e940e4a56399da40148afa"
      },
      "0051478858": {
        "111G-25": { CurrentQuantity: 0, ProductCount: 25 },
        "121G-25": { CurrentQuantity: 0, ProductCount: 25 },
        "212S-25": { CurrentQuantity: 0, ProductCount: 25 },
        "2220-25": { CurrentQuantity: 0, ProductCount: 25 },
        _id: "66e9411fa56399da40148afb"
      },
      "Test1": {
        "111G-25": { CurrentQuantity: 0, ProductCount: 25 },
        "121G-25": { CurrentQuantity: 0, ProductCount: 25 },
        "2220-25": { CurrentQuantity: 0, ProductCount: 25 },
        _id: "66e9411fa56399da40148afb"
      },
      "Test2": {
        "111G-25": { CurrentQuantity: 0, ProductCount: 25 },
        "121G-25": { CurrentQuantity: 0, ProductCount: 25 },
        "212S-25": { CurrentQuantity: 0, ProductCount: 25 },
        "2220-25": { CurrentQuantity: 0, ProductCount: 25 },
        _id: "66e9411fa56399da40148afb"
      }
    },
    PlateNumber: "19C19248",
    SortList: ["0051478858", "0041478858","Test1","Test2"],
    isAllOrderFull: true
  };
  allOrder = [dataTestNoCombine_new, {}, {}, dataTestNoCombine_new, dataTestNoCombine_new]
  const dataTestCombine_new = {
    "DateTimeIn": "2024-06-12T00:00:00+07:00",
    "IsCombine": true,
    "Orders": {
        "ordername": {
            "111G-25": {
                "CurrentQuantity": 0,
                "ProductCount": 50
            },
            "112S-25": {
                "CurrentQuantity": 0,
                "ProductCount": 25
            },
            "121G-25": {
                "CurrentQuantity": 0,
                "ProductCount": 25
            },
            "122G-25": {
                "CurrentQuantity": 0,
                "ProductCount": 25
            },
            "212S-25": {
                "CurrentQuantity": 0,
                "ProductCount": 25
            },
            "2220-25": {
                "CurrentQuantity": 0,
                "ProductCount": 50
            }
        }
    },
    "PlateNumber": "19C19248",
    "SortList": [
        "0051478858",
        "0041478858"
    ]
}
  // data = { ...dataTestNoCombine_new };
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.post(
  //         `${config.API_BASE_URL}/getCountingData`
  //       );
  //       console.log("response.data", response.data);
  //       setData(response.data);
        
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       setData({});
  //       setAllOrder([{}, {}, {}, {}, {}]);
  //       NProgress.done();
  //     }
  //   };

  //   fetchData(); // Initial fetch
  //   const intervalId = setInterval(fetchData, 1000); // Fetch every 1 seconds

  //   return () => clearInterval(intervalId); // Cleanup on unmount
  // }, []);

  const handleRefreshCountingData = () => {
    const refreshCountingData = async () => {
      try {
        NProgress.start();
        const response = await axios.post(
          `${config.API_BASE_URL}/refreshData`
        );
        console.log("response.data", response.data);
        setData(response.data);
        NProgress.done();
      } catch (error) {
        console.error("Error refreshing data:", error);
        NProgress.done();
      }
      finally {
        NProgress.done();
      }
    };

    refreshCountingData();
  }
  
  // const handleResetCountingData = () => {
  //   const resetCountingData = async () => {
  //     try {
  //       NProgress.start();
  //       const response = await axios.post(
  //         `${config.API_BASE_URL}/resetCountingData`
  //       );
  //       console.log("response.data", response.data);
  //       setData(response.data);
  //       NProgress.done();
  //     } catch (error) {
  //       console.error("Error refreshing data:", error);
  //       NProgress.done();
  //     }
  //     finally {
  //       NProgress.done();
  //     }
  //   };

  //   resetCountingData();
  // }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'space-between' }}>
        <div style={{height: '100%'}}>
          <Button 
            variant="outline-primary" 
            onClick={() => setShowAllOrder(false)} 
            style={{ 
              marginBottom: '10px', 
              marginRight: '10px', 
              backgroundColor: showAllOrder === false ? '#007bff' : 'transparent', 
              color: showAllOrder === false ? 'white' : '#007bff' 
            }}
          >
            Hiển thị 1 đơn hàng
          </Button>
          <Button 
            variant="outline-primary" 
            onClick={() => setShowAllOrder(true)} 
            style={{ 
              marginBottom: '10px', 
              marginRight: '10px', 
              backgroundColor: showAllOrder === true ? '#007bff' : 'transparent', 
              color: showAllOrder === true ? 'white' : '#007bff' 
            }}
          >
            Hiển thị 5 đơn hàng
          </Button>
        </div>
        <InputGroup className="mb-3" style={{ maxWidth: '300px', height: '100%' }}>
          <Form.Select aria-label="Chọn đơn hàng số" style={{ height: '100%' }} onChange={handleSelectChange}>
            <option value="1">Đơn hàng 1</option>
            <option value="2">Đơn hàng 2</option>
            <option value="3">Đơn hàng 3</option>
            <option value="4">Đơn hàng 4</option>
            <option value="5">Đơn hàng 5</option>
          </Form.Select>
        </InputGroup>
      </div>
      <div>
        {showAllOrder === false ? (
          allOrder[selectedOrder] && Object.keys(allOrder[selectedOrder]).length === 0 ? (
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
              <h1>Test2</h1>
              <BagCounting counting_data={allOrder[0]}/>
            </div>
          ) 
        ) : (
          <div style={{ display: 'flex', flexWrap: 'nowrap', height: 'calc(100vh - 180px)', justifyContent: 'space-between' }}>
            {allOrder.map((order, index) => (
              order && Object.keys(order).length === 0 ? (
                <div key={index}> {/* Thêm key prop cho phần tử cha */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px', alignItems: 'center' }}>
                    <AiFillBell style={{ marginRight: '8px', color: 'white', fontSize: '40px' }} className={isShaking ? styles.bellShake : ''}
                      onClick={handleShak}
                    />
                    <Button variant="outline-info" onClick={handleRefreshCountingData}>
                      Làm mới đơn hàng
                    </Button>
                  </div>
                  <Card key={index} className="text-center" style={{ marginTop: "0px", flex: '1 1 20%', overflowY: "auto" }}>
                    <Card.Body>
                      <Card.Title>OrderName: {index + 1}</Card.Title>
                      <Card.Title>Không có dữ liệu</Card.Title>
                      <Card.Text>Chưa có đơn hàng được gọi</Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              ) : (
                <div key={index}> {/* Thêm key prop cho phần tử cha */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px', alignItems: 'center', cursor: 'pointer' }}>
                    <AiFillBell style={{ marginRight: '8px', color: 'white', fontSize: '40px' }} className={isShaking ? styles.bellShake : ''}
                      onClick={handleShak}
                    />
                    <Button variant="outline-info" onClick={handleRefreshCountingData}>
                      Làm mới đơn hàng
                    </Button>
                  </div>
                  <BagCounting counting_data={order} />
                </div>
              )
            ))}
          </div>
        )}
      </div>
      {/* {data && Object.keys(data).length === 0 ? (
        <Card className="text-center" style={{ marginTop: "20px" }}>
          <Card.Body>
            <Card.Title>Không có dữ liệu</Card.Title>
            <Card.Text>Chưa có đơn hàng được gọi</Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <BagCounting counting_data={data} orderCount={orderCount} />
      )} */}
    </div>
  );
};

export default AFCHome;
