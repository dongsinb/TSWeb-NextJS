# app.py
import time

from flask import Flask, request, Response, jsonify, send_file
from flask_cors import CORS
from bson.objectid import ObjectId
from pymongo.mongo_client import MongoClient
import numpy as np
import cv2
import io
import base64
import copy
import socket
import threading
from bson.json_util import dumps
from pyModbusTCP.client import ModbusClient

app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
CORS(app)
global_image = None
ocr_results = None

class PLCManagement():
    def __init__(self):
        self.clientPLC = {"Line1": None,}
                          # "Line2": None,
                          # "Line3": None,
                          # "Line4": None,
                          # "Line5": None}

        # value of number products that are counted from server
        self.server_product_count = {"Line1": 0,}
                                      # "Line2": 0,
                                      # "Line3": 0,
                                      # "Line4": 0,
                                      # "Line5": 0}
        self.self_PLC_infor = {"Line1": {"host":'192.168.100.164',
                                    "port":10000},}
                          # "Line2": {"host":'192.168.100.4',
                          #           "port":502},
                          # "Line3": {"host":'192.168.100.3',
                          #           "port":502},
                          # "Line4": {"host":'192.168.100.2',
                          #           "port":502},
                          # "Line5": {"host":'192.168.100.1',
                          #           "port":502}}
        self.lock = threading.Lock()  # To ensure thread-safe operations
        self.connect_PLC()
    def connect_PLC(self, lines=None):
        if lines is None:
            lines = list(self.clientPLC.keys())
        def connect():
            for line in lines:
                if self.clientPLC[line] is None:
                    try:
                        with self.lock:  # Ensure thread-safe access to `clientPLC`
                            self.clientPLC[line] = ModbusClient(
                                host=self.self_PLC_infor[line]['host'],
                                port=self.self_PLC_infor[line]['port'],
                                unit_id=1,
                                timeout=2.00,
                                debug=True
                            )
                            if not self.clientPLC[line].open():
                                raise ConnectionError(f"Failed to open connection to {line}")
                    except Exception as e:
                        print(f"Error connecting to PLC at {line}: {e}")
                        self.clientPLC[line] = None

        # Run connection PLC in a thread
        thread = threading.Thread(target=connect, daemon=True)  # set daemon=True to terminate automatically when the main program exits.
        thread.start()

    def start_program(self, line):
        if self.clientPLC[line] is not None:
            _ = self.clientPLC[line].write_single_register(5, 1)
        else:
            self.connect_PLC([line])

    def finish_program(self, line):
        if self.clientPLC[line] is not None:
            _ = self.clientPLC[line].write_single_register(5, 0)
        else:
            self.connect_PLC([line])

    def run_conveyor(self, line):
        if self.clientPLC[line] is not None:
            _ = self.clientPLC[line].write_single_register(6, 0)
        else:
            self.connect_PLC([line])

    def stop_conveyor(self, line):
        if self.clientPLC[line] is not None:
            _ = self.clientPLC[line].write_single_register(6, 1)
        else:
            self.connect_PLC([line])

    def set_light_yellow(self, line):
        if self.clientPLC[line] is not None:
            _ = self.clientPLC[line].write_single_register(7, 1)
        else:
            self.connect_PLC([line])

    def set_light_green(self, line):
        if self.clientPLC[line] is not None:
            _ = self.clientPLC[line].write_single_register(7, 0)
        else:
            self.connect_PLC([line])

    def check_slots_pass(self, line):
        # Read 5 holding registers starting from address 0, it means reading value of registers 0,1,2,3,4
        slots = self.clientPLC[line].read_holding_registers(0, 5)
        PLC_product_count = self.clientPLC[line].read_holding_registers(9, 1)  # value of number product that are counted from sensors
        for idx, value in enumerate(slots):
            if int(PLC_product_count[0]) > value:
                _ = self.clientPLC[line].write_single_register(idx, 0)

    def set_current_NG_counting(self, line):
        if self.clientPLC[line] is not None:
            self.check_slots_pass(line)
            # Read 5 holding registers starting from address 0, it means reading value of registers 0,1,2,3,4
            slots = self.clientPLC[line].read_holding_registers(0, 5)
            for idx, value in enumerate(slots):
                if value == 0:
                    _ = self.clientPLC[line].write_single_register(idx, self.server_product_count[line])
                    break
        else:
            self.connect_PLC([line])

class LedManagerment():
    def __init__(self):
        self.client_socket = {"Line1" : None,
                              "Line2" : None,
                              "Line3" : None,
                              "Line4" : None,
                              "Line5" : None}

        # Connect led server 1
        client_socket1 = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client_socket1.connect(('192.168.43.250', 10000))
        self.client_socket["Line1"] = client_socket1

        # Connect led server 2
        client_socket2 = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client_socket2.connect(('192.168.43.251', 10000))
        self.client_socket["Line2"] = client_socket2

        # Connect led server 3
        client_socket3 = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client_socket3.connect(('192.168.43.252', 10000))
        self.client_socket["Line3"] = client_socket3

        # Connect led server 4
        client_socket4 = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client_socket4.connect(('192.168.43.253', 10000))
        self.client_socket["Line4"] = client_socket4

        # Connect led server 5
        client_socket5 = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client_socket5.connect(('192.168.43.254', 10000))
        self.client_socket["Line5"] = client_socket5

    def updateLed(self, line, total_count, orders, is_counting):
        if is_counting:
            message = "*[H1][C1]Đang đếm*[H2][C1]Tổng: {}".format(total_count)
            line_count = 3
            for productCode in orders.keys():
                productCount = orders[productCode]["ProductCount"]
                currentQuantity = orders[productCode]["CurrentQuantity"]
                if currentQuantity < productCount:
                    message += "*[H{}][C1]{}: {}/{}".format(line_count,productCode,currentQuantity,productCount)
                    line_count += 1
                    if line_count > 8:
                        break
            message += "[!]"
        else:
            message = "*[H1][C5]Dừng đếm[!]"

        self.client_socket[line].sendall(message.encode())


class CallingDataHandler():
    def __init__(self, dbmanager, ledManager, plcManager):
        self.dbmanager = dbmanager
        self.ledManager = ledManager
        self.plcManager = plcManager
        self.not_count_weight = ['05'] # do not count this kind of weight of product
        self.reset()

    def reset(self, line=""):
        if line == "":  # reset all lines
            self.line_platenumber_data = {"Line1" : "",
                                          "Line2" : "",
                                          "Line3" : "",
                                          "Line4" : "",
                                          "Line5" : ""}
            self.calling_data = {"Line1" : {},
                                 "Line2" : {},
                                 "Line3" : {},
                                 "Line4" : {},
                                 "Line5" : {}}
            self.orders_status = {"Line1" : {"currentOrderName": "",
                                            "product": {},
                                            "total_count": 0},
                                  "Line2": {"currentOrderName": "",
                                            "product": {},
                                            "total_count": 0},
                                  "Line3": {"currentOrderName": "",
                                            "product": {},
                                            "total_count": 0},
                                  "Line4": {"currentOrderName": "",
                                            "product": {},
                                            "total_count": 0},
                                  "Line5": {"currentOrderName": "",
                                            "product": {},
                                            "total_count": 0}}
        else:   # reset specific line
            self.line_platenumber_data[line] = ""
            self.calling_data[line] = {}
            self.orders_status[line] = {"currentOrderName": "",
                                        "product": {},
                                        "total_count": 0}

    def init_orders_status(self, line):
        self.orders_status[line] = {"currentOrderName": "",
                                    "product": {},
                                    "total_count": 0}
        if self.calling_data[line]["IsCombine"]:
            self.orders_status[line]["currentOrderName"] = "ordername"
        else:
            self.orders_status[line]["currentOrderName"] = list(self.calling_data[line]["Orders"].keys())[0]
        for productCode, product in self.calling_data[line]["Orders"][self.orders_status[line]["currentOrderName"]].items():
            if productCode != "_id":
                if product["CurrentQuantity"] < product["ProductCount"]:
                    self.orders_status[line]["product"][productCode] = False
                else:
                    self.orders_status[line]["product"][productCode] = True

    def preprocess_calling_data(self, calling_data):
        # set all product has weight in not_count_weight list is full
        if calling_data["IsCombine"]:
            for productCode in calling_data["Orders"]["ordername"].keys():
                weight = productCode.split('-')[-1]
                if weight in self.not_count_weight:
                    calling_data["Orders"]["ordername"][productCode]["CurrentQuantity"] = calling_data["Orders"]["ordername"][productCode]["ProductCount"]
        else:
            for ordername in calling_data["Orders"].keys():
                for productCode in calling_data["Orders"][ordername].keys():
                    weight = productCode.split('-')[-1]
                    if weight in self.not_count_weight:
                        calling_data["Orders"][ordername][productCode]["CurrentQuantity"] = calling_data["Orders"][ordername][productCode]["ProductCount"]
        return calling_data

    def set_calling_data(self, calling_data, data):
        line = data['Line']
        plateNumber = data['PlateNumber']
        self.line_platenumber_data[line] = plateNumber
        self.calling_data[line] = self.preprocess_calling_data(calling_data)
        if self.calling_data[line]:
            self.init_orders_status(line)

    # check if all orders are full, if not, with orders are not combined, if all products in current order are full, go next order in a calling truck
    def check_AllOrderFull(self, line):
        if self.calling_data[line]["IsCombine"]:
            if False in list(self.orders_status[line]["product"].values()):
                self.calling_data[line]["IsAllOrderFull"] = False
            else:
                self.calling_data[line]["IsAllOrderFull"] = True
        else:
            if False in list(self.orders_status[line]["product"].values()):
                is_current_order_full = False
            else:
                is_current_order_full = True
            if is_current_order_full:
                idx = list(self.calling_data[line]["Orders"].keys()).index(self.orders_status[line]["currentOrderName"])
                if idx < len(self.calling_data[line]["Orders"].keys()) - 1:
                    self.orders_status[line]["currentOrderName"] = list(self.calling_data[line]["Orders"].keys())[idx+1]
                    self.orders_status[line]["product"] = {}  # reset productCode list
                    for productCode, product in self.calling_data[line]["Orders"][self.orders_status[line]["currentOrderName"]].items():
                        if productCode != "_id":
                            if product["CurrentQuantity"] < product["ProductCount"]:
                                self.orders_status[line]["product"][productCode] = False
                            else:
                                self.orders_status[line]["product"][productCode] = True
                else:
                    self.calling_data[line]["IsAllOrderFull"] = True

    def counting(self, line, productCode):
        weight = productCode.split('-')[-1]
        if weight not in self.not_count_weight:
            isUpdate = False
            self.orders_status[line]["total_count"] += 1
            #self.ledManager.updateLed(line, self.orders_status[line]["total_count"], self.calling_data[line]["Orders"][self.orders_status[line]["currentOrderName"]], is_counting=True)
            if self.calling_data[line]["IsCombine"]:
                if self.calling_data[line]["Orders"]["ordername"][productCode]["CurrentQuantity"] < self.calling_data[line]["Orders"]["ordername"][productCode]["ProductCount"]:
                    self.calling_data[line]["Orders"]["ordername"][productCode]["CurrentQuantity"] += 1
                    isUpdate = True
                    self.dbmanager.update_OrderData_counting(productCode, self.calling_data[line]["SortList"], self.calling_data[line])
                    if self.calling_data[line]["Orders"]["ordername"][productCode]["CurrentQuantity"] == self.calling_data[line]["Orders"]["ordername"][productCode]["ProductCount"]:
                        self.orders_status[line]["product"][productCode] = True
                else:
                    self.orders_status[line]["product"][productCode] = True
            else:
                if self.calling_data[line]["Orders"][self.orders_status[line]["currentOrderName"]][productCode]["CurrentQuantity"] < self.calling_data[line]["Orders"][self.orders_status[line]["currentOrderName"]][productCode]["ProductCount"]:
                    self.calling_data[line]["Orders"][self.orders_status[line]["currentOrderName"]][productCode]["CurrentQuantity"] += 1
                    isUpdate = True
                    self.dbmanager.update_OrderData_counting(productCode, [self.orders_status[line]["currentOrderName"]], self.calling_data[line])
                    if self.calling_data[line]["Orders"][self.orders_status[line]["currentOrderName"]][productCode]["CurrentQuantity"] == self.calling_data[line]["Orders"][self.orders_status[line]["currentOrderName"]][productCode]["ProductCount"]:
                        self.orders_status[line]["product"][productCode] = True
                else:
                    self.orders_status[line]["product"][productCode] = True
            self.check_AllOrderFull(line)
            if self.calling_data[line]["IsAllOrderFull"]:
                self.dbmanager.update_finish_status(self.calling_data[line]["DateTimeIn"], self.calling_data[line]["PlateNumber"])
                #self.ledManager.updateLed(line, self.orders_status[line]["total_count"], self.calling_data[line]["Orders"][self.orders_status[line]["currentOrderName"]], is_counting=False)
            return isUpdate
        else:   # do not count
            return True

    def check_line(self, line, dateTimeIn):
        is_error = True
        date = "^" + dateTimeIn.split('T')[0]  # for search regex all document have value start with date
        cursor = self.dbmanager.confuseCollection.find({"DateTimeIn": {"$regex": date},
                                              "Line": line})
        for document in cursor:
            if document["IsConfirm"]:
                is_error = False
        return is_error

    def classify_ConfuseData(self, data):
        line = data["Line"]
        productCode = data["ProductCode"]
        result = self.dbmanager.confuseCollection.update_one({"_id": ObjectId(data['_id'])}, {"$set": {"IsConfirm": True}})   # update IsConfirm of current confuse data to True
        if productCode != "":   # classify OK, only update product that have classification infor
            isUpdate = self.counting(line, productCode)
            if isUpdate:
                mess = {"Message": "Thành công ! Mã sản phẩm đã được cập nhật vào đơn hàng hiện tại"}
            else:
                mess = {"Message": "Lỗi ! Đơn hàng hiện tại đã đầy, không thể cập nhật thêm"}
            self.plcManager.run_conveyor(line)
        else:   # classify NG, send counting to PLC for employee bring out
            mess = {"Message": "Hàng đã phân loại là lỗi"}
            self.plcManager.set_current_NG_counting(line)
            self.plcManager.set_light_yellow(line)      # PLC will auto set run conveyor and light to green again after some seconds

        # check line still have error order or have classified
        is_error = self.check_line(line, self.calling_data[line]["DateTimeIn"])
        self.calling_data[line]["IsError"] = is_error

        return mess

class DBManagerment():
    def __init__(self, uri, dbname, OrderCollection, ConfuseCollection) -> None:
        client = MongoClient(uri)
        try:
            self.db = client[dbname]
            self.orderCollection = self.db[OrderCollection]
            self.confuseCollection = self.db[ConfuseCollection]
            self.waiting_orders = {}
            self.orderName_ID_dict = {}
            self.current_calling_ordername = ''
        except Exception as e:
            print(e)

    def get_order_documents(self, ref_dateTimeIn):
        data = {}
        for status in ["Waiting", "Finished"]:
            docs = []
            doc_dict = {}
            ref_date = "^" + ref_dateTimeIn.split('T')[0]  # for search regex all document have value start with date
            cursor = self.orderCollection.find({"DateTimeIn": {"$regex": ref_date},
                                                "Status": status})
            for document in cursor:
                document['_id'] = str(document['_id'])  # convert object_id from mongodb to string, then parse to json to send client
                plateNumber = document['PlateNumber']
                key = plateNumber
                if key not in doc_dict:
                    doc_dict[key] = copy.deepcopy(document)
                    doc_dict[key]["Orders"] = {document["OrderName"] : copy.deepcopy(document["Orders"])}
                    doc_dict[key]["Orders"][document["OrderName"]]["_id"] = copy.deepcopy(document['_id'])
                    doc_dict[key].pop('_id', None)
                    doc_dict[key].pop('OrderName', None)
                    doc_dict[key].pop('Status', None)
                else:
                    doc_dict[key]["Orders"][document["OrderName"]] = copy.deepcopy(document["Orders"])
                    doc_dict[key]["Orders"][document["OrderName"]]["_id"] = copy.deepcopy(document['_id'])
            if doc_dict:
                for k, v in doc_dict.items():
                    docs.append(v)
            data[status] = docs
            if status == "Waiting":
                self.waiting_orders = copy.deepcopy(doc_dict)
        return data

    def get_confuse_documents(self, dateTimeIn):
        data = []
        date = "^" + dateTimeIn.split('T')[0]   # for search regex all document have value start with date
        cursor = self.confuseCollection.find({"DateTimeIn": {"$regex": date},
                                              "IsConfirm": False})
        for document in cursor:
            document['_id'] = str(document['_id'])  # convert object_id from mongodb to string, then parse to json to send client
            data.append(document)
        return data

    def get_documents_by_platenumber(self, plate_number, search_date):
        data = {}
        for status in ["Waiting", "Finished"]:
            docs = []
            doc_dict = {}
            if search_date != "":
                date = "^" + search_date  # for search regex all document have value start with date
                cursor = self.orderCollection.find({"DateTimeIn": {"$regex": date},
                                                      "PlateNumber": plate_number,
                                                      "Status": status})
            else:
                cursor = self.orderCollection.find({"PlateNumber": plate_number,
                                                      "Status": status})
            for document in cursor:
                print('alo')
                print(document)
                document['_id'] = str(document['_id'])
                date = document['DateTimeIn'].split('T')[0]
                if date not in doc_dict:
                    doc_dict[date] = copy.deepcopy(document)
                    doc_dict[date]["Orders"] = {document["OrderName"]: copy.deepcopy(document["Orders"])}
                    doc_dict[date]["Orders"][document["OrderName"]]["_id"] = copy.deepcopy(document['_id'])
                    doc_dict[date].pop('_id', None)
                    doc_dict[date].pop('OrderName', None)
                    doc_dict[date].pop('Status', None)
                else:
                    doc_dict[date]["Orders"][document["OrderName"]] = copy.deepcopy(document["Orders"])
                    doc_dict[date]["Orders"][document["OrderName"]]["_id"] = copy.deepcopy(document['_id'])
            if doc_dict:
                for k, v in doc_dict.items():
                    docs.append(v)
            data[status] = docs
        return data

    def get_documents_by_status(self, status):
        # Query the database
        docs = []
        cursor = self.orderCollection.find({"Status": status})
        for document in cursor:
            print(document)
            document['_id'] = str(document['_id'])  # convert object_id from mongodb to string, then parse to json to send client
            docs.append(document)
        return docs

    def insert_data(self, data):
        # Perform the insert operation
        result = self.orderCollection.insert_one(data)
        # Check if the document was inserted
        if result.inserted_id:
            print("Document insert successfully")
            return True
        else:
            print("Document insert failed")
            return False

    def insert_ConfuseData(self, data, plateNumber, ordername, productCode_list):
        save_data = {
              "Line": data["Line"],
              "DateTimeIn": data["DateTimeIn"],
              "PlateNumber": plateNumber,
              "OrderName": ordername,
              "Products": productCode_list,
              "Message": data["Message"],
              "Image": data["imageBase64"],
              "IsConfirm": False}

        # Perform the insert operation
        result = self.confuseCollection.insert_one(save_data)
        # Check if the document was inserted
        if result.inserted_id:
            print("Document insert successfully")
            return True
        else:
            print("Document insert failed")
            return False

    def update_OrderData(self, data):
        set_data = {}
        for productCode, value in data.items():
            if productCode != '_id':
                for productInfo, valueInfo in value.items():
                    k = "Orders" + "." + productCode + "." + productInfo
                    set_data[k] = valueInfo
        update = {
            "$set": set_data
        }

        # Update the document
        result = self.orderCollection.update_one({"_id": ObjectId(data['_id'])}, update)

        # Check the result
        if result.modified_count > 0:


            print("Document updated successfully.")
            return True
        else:
            print("No documents matched the query or no changes made.")
            return False

    def update_OrderData_counting(self, productCode, orderNameList, line_calling_data):
        if line_calling_data["IsCombine"]:
            is_updated = False
            for orderName in orderNameList:
                cursor = self.orderCollection.find({"OrderName": orderName})
                for document in cursor:
                    if productCode in document["Orders"]:
                        if document["Orders"][productCode]["CurrentQuantity"] < document["Orders"][productCode]["ProductCount"]:
                            data = copy.deepcopy(document["Orders"])
                            data["_id"] = copy.copy(document["_id"])
                            data[productCode]["CurrentQuantity"] += 1
                            self.update_OrderData(data)
                            is_updated = True
                        else:
                            break
                if is_updated:
                    break
        else:
            # update value directly to current orderName
            self.update_OrderData(line_calling_data["Orders"][orderNameList[0]])

    def update_finish_status(self, dateTimeIn, plateNumber):
        date = "^" + dateTimeIn.split('T')[0]  # for search regex all document have value start with date
        result = self.orderCollection.update_many(
            {
                "PlateNumber": plateNumber,  # Match by PlateNumber
                "DateTimeIn": {"$regex": date}  # Match by DateTimeIn
            },
            {
                "$set": {"Status": "Finished"}  # Set Status to "Finished"
            }
        )
        # Check the result
        if result.modified_count > 0:
            print("Document updated successfully.")
            return True
        else:
            print("No documents matched the query or no changes made.")
            return False

    def orders_sorting(self, data):
        sortList = data["SortList"]
        isCombine = data["IsCombine"]
        plateNumber = data['PlateNumber']
        key = plateNumber
        orders = self.waiting_orders[key]["Orders"]
        if isCombine:
            sorted_orders = {"ordername":{}}
            for orderName, order in orders.items():
                for productCode, product in order.items():
                    if productCode != "_id":
                        if productCode not in sorted_orders["ordername"]:
                            sorted_orders["ordername"][productCode] = copy.deepcopy(product)
                        else:
                            sorted_orders["ordername"][productCode]["ProductCount"] += product["ProductCount"]
                            sorted_orders["ordername"][productCode]["CurrentQuantity"] += product["CurrentQuantity"]
        else:
            sorted_orders = {}
            for orderName in sortList:
                sorted_orders[orderName] = copy.deepcopy(orders[orderName])
        result = copy.deepcopy(self.waiting_orders[key])
        result["Orders"] = sorted_orders
        result["SortList"] = copy.copy(sortList)
        result["IsCombine"] = copy.copy(isCombine)
        result["IsAllOrderFull"] = False
        result["IsError"] = False
        result["DateTimeIn"] = copy.copy(data['DateTimeIn'])
        result["PlateNumber"] = copy.copy(data['PlateNumber'])
        return result


# dbmanager = DBManagerment(uri="mongodb+srv://quannguyen:quanmongo94@cluster0.b09slu1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", dbname="AFC", OrderCollection="OrderData", ConfuseCollection="ConfuseData")
# dbmanager = DBManagerment(uri="mongodb://localhost:27017", dbname="AFC", OrderCollection="OrderData", ConfuseCollection="ConfuseData")
dbmanager = DBManagerment(uri="mongodb://test:123@localhost:27017", dbname="AFC", OrderCollection="OrderData", ConfuseCollection="ConfuseData")
plcManager = PLCManagement()
#ledManager = LedManagerment()
ledManager = None
dataHandler = CallingDataHandler(dbmanager, ledManager, plcManager)



# [TSWeb] Upload image from phone to server
@app.route('/upload_img', methods=['POST'])
def upload_img():
    global global_image
    data = request.get_json()
    # print("data: ", data)
    if 'image' not in data:
        return 'No image part', 400

    image_data = base64.b64decode(data['image'])
    np_arr = np.frombuffer(image_data, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    global_image = image.copy()

    if image is None:
        return 'File could not be decoded', 400

    # cv2.imshow('Uploaded Image', image)
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()

    return 'File successfully uploaded and displayed', 200

# [TSVision] Get image from server to TSTech app
@app.route('/get_img', methods=['GET'])
def get_img():
    try:
        global global_image
        if global_image is None:
            return jsonify({'message': 'File not found or cannot be read'}), 404
        # Convert the image to JPEG format and save to a BytesIO object
        is_success, buffer = cv2.imencode('.jpg', global_image)
        if not is_success:
            return jsonify({'message': 'Image encoding failed'}), 500
        img_io = io.BytesIO(buffer)
        img_io.seek(0)

        global_image = None  # reset image to None after send
        return send_file(img_io, mimetype='image/jpeg')
    except Exception as e:
        print(e)
        return jsonify({'message': str(e)}), 500

# [TSVision] Send results from TSTech app to server
@app.route("/send_results", methods=["POST"])
def send_results():
    global ocr_results
    if request.method == 'POST':
        ocr_results = request.get_json()

    # Check if data is received
    if not ocr_results:
        return jsonify({"error": "No JSON data received"}), 400
    else:
        # print(ocr_results)
        return jsonify({'message': 'File uploaded successfully'}), 200

# [TSWeb] Get OCR results from server to phone
@app.route("/get_results", methods=["GET"])
def get_results():
    global ocr_results
    results = None
    if request.method == 'GET':
        results = copy.deepcopy(ocr_results)
        ocr_results = None
        if results:
            return jsonify([results]), 200
        else:
            return jsonify([]), 200
    else:
        return jsonify({'message': 'Wrong api method'}), 400

# [TSWeb] Get all data from mongodb to web
@app.route("/getOrderData", methods=['POST'])
def getOrderData():
    try:
        data = request.json
        dateTimeIn = data.get('DateTimeIn')
        return_data = dbmanager.get_order_documents(dateTimeIn)
        return dumps(return_data)
        # return jsonify(return_data)
    except Exception as e:
        return jsonify({"error": str(e)})

# [TSWeb] Get all data by plate number from mongodb to web
@app.route('/getDatabyPlateNumber', methods=['POST'])
def getDatabyPlateNumber():
    try:
        data = request.json
        plate_number = data.get('PlateNumber')
        date = data.get('DateTimeIn')
        return jsonify(dbmanager.get_documents_by_platenumber(plate_number, date))
    except Exception as e:
        return jsonify({"error": str(e)})


# [TSWeb] Insert data to mongodb from web
@app.route('/insertData', methods=['POST'])
def insertData():
    isPush = False
    if request.method == 'POST':
        data = request.json
        isPush = dbmanager.insert_data(data)
    return jsonify(isPush)

# [TSWeb] Sorting order when calling truck
@app.route('/sortingData', methods=['POST'])
def sortingData():
    data = request.json
    plcManager.start_program(data["Line"])
    dataHandler.set_calling_data(dbmanager.orders_sorting(data), data)
    return jsonify(dataHandler.calling_data)

# [TSVision] Start counting order, if attach with image, not count but save it to confuse data
@app.route('/countingData', methods=['POST'])
def countingData():
    data = request.json
    line = data["Line"]
    plcManager.server_product_count[line] += 1

    if data['imageBase64'] == "":
        productCode = data["ProductCode"]
        dataHandler.counting(line, productCode)
    else:
        dbmanager.insert_ConfuseData(data, dataHandler.calling_data[line]['PlateNumber'], dataHandler.orders_status[line]['currentOrderName'], list(dataHandler.orders_status[line]['product'].keys()))
        dataHandler.calling_data[line]["IsError"] = True
        plcManager.stop_conveyor(line)

    return jsonify(dataHandler.calling_data)

# [TSWeb] Refresh data, update lastest data after edit
@app.route('/refreshData', methods=['POST'])
def refreshData():
    for line in dataHandler.calling_data.keys():
        if dataHandler.calling_data[line]:
            dateTimeIn = dataHandler.calling_data[line]["DateTimeIn"]
            break
    _ = dbmanager.get_order_documents(dateTimeIn)
    for line in dataHandler.calling_data.keys():
        if dataHandler.calling_data[line]:
            data = {"Line" : line,
                    "DateTimeIn": dataHandler.calling_data[line]["DateTimeIn"],
                    "IsCombine": dataHandler.calling_data[line]["IsCombine"],
                    "PlateNumber": dataHandler.calling_data[line]["PlateNumber"],
                    "SortList": dataHandler.calling_data[line]["SortList"]}
            dataHandler.set_calling_data(dbmanager.orders_sorting(data), data)

            dataHandler.check_AllOrderFull(line)
            if dataHandler.calling_data[line]["IsAllOrderFull"]:
                dbmanager.update_finish_status(dataHandler.calling_data[line]["DateTimeIn"],
                                                    dataHandler.calling_data[line]["PlateNumber"])
    return jsonify(dataHandler.calling_data)

# [TSVision] Get list counting product
@app.route('/getListProductCode', methods=['POST'])
def getListProductCode():
    data = request.json
    line = data["Line"]
    plate_number = dataHandler.line_platenumber_data[line]
    return_data = copy.deepcopy(dataHandler.orders_status[line])
    return_data["PlateNumber"] = plate_number
    return jsonify(return_data)

# [TSWeb] Get confuse data
@app.route("/getConfuseData", methods=['POST'])
def getConfuseData():
    try:
        for line in dataHandler.calling_data.keys():
            if dataHandler.calling_data[line]:
                dateTimeIn = dataHandler.calling_data[line]["DateTimeIn"]
                break
        return_data = dbmanager.get_confuse_documents(dateTimeIn)
        return jsonify(return_data)
    except Exception as e:
        return jsonify({"error": str(e)})

# [TSWeb] Edit order data
@app.route("/updateOrderData", methods=['POST'])
def updateOrderData():
    data = request.json
    isUpdate = dbmanager.update_OrderData(data)
    refreshData()
    return jsonify(isUpdate)

# [TSWeb] Classify confuse data
@app.route("/classifyConfuseData", methods=['POST'])
def classifyConfuseData():
    data = request.json
    mess = dataHandler.classify_ConfuseData(data)
    return jsonify(mess)

# [TSWeb] get current calling data
@app.route('/getCountingData', methods=['POST'])
def getCountingData():
    try:
        return jsonify(dataHandler.calling_data)
    except Exception as e:
        return jsonify({"error": str(e)})
    
@app.route('/resetCountingData', methods=['POST'])
def resetCountingData():
    try:
        data = request.json
        line = data["Line"]
        dataHandler.reset(line)
        return jsonify(dataHandler.calling_data)
    except Exception as e:
        return jsonify({"error": str(e)})

# [TSWeb] get current car in each line
@app.route('/getLineInfor', methods=['POST'])
def getLineInfor():
    try:
        for line in dataHandler.calling_data.keys():
            if dataHandler.calling_data[line]:
                if dataHandler.calling_data[line]["IsAllOrderFull"]:    # if all order full in this line, reset platenumber of this line
                    dataHandler.line_platenumber_data[line] = ""
        return jsonify(dataHandler.line_platenumber_data)
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    # app.run(host='192.168.88.132', port=5000)
    app.run(host='192.168.100.134', port=5000)
    # app.run(host='192.168.100.164', port=5000)