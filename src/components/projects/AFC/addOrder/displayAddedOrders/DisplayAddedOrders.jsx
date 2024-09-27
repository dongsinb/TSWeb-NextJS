import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';

const DisplayAddedOrders = ({sheetName, order, handleRemoveOrder, handleConfirmOrder }) => {
    const [orders, setOrders] = useState(order?.Orders || {});
    const [plateNumber, setPlateNumber] = useState(order.PlateNumber);
    const [orderName, setOrderName] = useState(order.OrderName);

    const handleInputChange = (index, field, value) => {
        const updatedOrders = Object.entries(orders).map(([productCode, product], i) => {
            if (i === index) {
                return { ...product, [field]: value };
            }
            return product;
        });
        setOrders(Object.fromEntries(updatedOrders.map((product, i) => [Object.keys(orders)[i], product])));
    };

    const confirmOrder = () => {
        console.log("confirm order");
        console.log("orders: ", orders);
        const confirmOrder = {
            ...order,
            PlateNumber: plateNumber, 
            OrderName: orderName,
            Orders: orders      
        };
        handleConfirmOrder(sheetName, confirmOrder);
        // console.log("confirmOrder: ", JSON.stringify(confirmOrder));
    };

    return (
        <div>
            <h4>Thông tin xe và đơn hàng</h4>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Plate Number</th>
                        <th>Date Time In</th>
                        <th>Order Name</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <Form.Control type="text" value={plateNumber} onChange={(e) => {setPlateNumber(e.target.value)}} />
                        </td>
                        <td>{order.DateTimeIn}</td>
                        <td>
                            <Form.Control type="text" value={orderName} onChange={(e) => {setOrderName(e.target.value)}} />
                        </td>
                        <td>{order.Status}</td>
                    </tr>
                </tbody>
            </Table>
            <h4>Sản phẩm</h4>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Product Code</th>
                        <th>Product Count</th>
                        <th>Current Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(orders).map(([productCode, product], index) => (
                        <tr key={index}>
                            <td>{productCode}</td>
                            <td>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    value={product.ProductCount}
                                    onChange={(e) => handleInputChange(index, 'ProductCount', parseInt(e.target.value))}
                                />
                            </td>
                            <td>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    value={product.CurrentQuantity}
                                    onChange={(e) => handleInputChange(index, 'CurrentQuantity', parseInt(e.target.value))}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                <Button variant="outline-danger" onClick={() => handleRemoveOrder(sheetName)}>Remove</Button>
                <Button variant="outline-success" onClick={() => confirmOrder()}>Confirm</Button>
            </div> 
        </div>
    );

};

export default DisplayAddedOrders;