# app.py
from flask import Flask, request, Response, jsonify, send_file
from flask_cors import CORS
from bson.objectid import ObjectId
from pymongo.mongo_client import MongoClient
import numpy as np
import cv2
import io
import base64
import copy

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

global_image = None
ocr_results = None

class CallingDataHandler():
    def __init__(self, dbmanager):
        self.dbmanager = dbmanager
        self.reset()

    def reset(self):
        self.calling_data = {}
        self.orders_status = {"currentOrderName": "",
                              "product": {}}

    def init_orders_status(self):
        self.orders_status = {"currentOrderName": "",
                              "product": {}}
        if self.calling_data["IsCombine"]:
            self.orders_status["currentOrderName"] = "ordername"
        else:
            self.orders_status["currentOrderName"] = list(self.calling_data["Orders"].keys())[0]
        for productCode, product in self.calling_data["Orders"][self.orders_status["currentOrderName"]].items():
            if productCode != "_id":
                if product["CurrentQuantity"] < product["ProductCount"]:
                    self.orders_status["product"][productCode] = False
                else:
                    self.orders_status["product"][productCode] = True

    def set_calling_data(self, calling_data):
        self.calling_data = calling_data
        if self.calling_data:
            self.init_orders_status()

    # check if all orders are full, if not, with orders are not combined, if all products in current order are full, go next order in a calling truck
    def check_AllOrderFull(self):
        if self.calling_data["IsCombine"]:
            if False in list(self.orders_status["product"].values()):
                self.calling_data["isAllOrderFull"] = False
            else:
                self.calling_data["isAllOrderFull"] = True
        else:
            if False in list(self.orders_status["product"].values()):
                is_current_order_full = False
            else:
                is_current_order_full = True
            if is_current_order_full:
                idx = list(self.calling_data["Orders"].keys()).index(self.orders_status["currentOrderName"])
                if idx < len(self.calling_data["Orders"].keys()) - 1:
                    self.orders_status["currentOrderName"] = list(self.calling_data["Orders"].keys())[idx+1]
                    self.orders_status["product"] = {}  # reset productCode list
                    for productCode, product in self.calling_data["Orders"][self.orders_status["currentOrderName"]].items():
                        if productCode != "_id":
                            if product["CurrentQuantity"] < product["ProductCount"]:
                                self.orders_status["product"][productCode] = False
                            else:
                                self.orders_status["product"][productCode] = True
                else:
                    self.calling_data["isAllOrderFull"] = True

    def counting(self, productCode):
        if self.calling_data["IsCombine"]:
            if self.calling_data["Orders"]["ordername"][productCode]["CurrentQuantity"] < self.calling_data["Orders"]["ordername"][productCode]["ProductCount"]:
                self.calling_data["Orders"]["ordername"][productCode]["CurrentQuantity"] += 1
                self.dbmanager.update_OrderData_counting(productCode, dataHandler.calling_data["SortList"], dataHandler.calling_data)
                if self.calling_data["Orders"]["ordername"][productCode]["CurrentQuantity"] == self.calling_data["Orders"]["ordername"][productCode]["ProductCount"]:
                    self.orders_status["product"][productCode] = True
            else:
                self.orders_status["product"][productCode] = True
        else:
            if self.calling_data["Orders"][self.orders_status["currentOrderName"]][productCode]["CurrentQuantity"] < self.calling_data["Orders"][self.orders_status["currentOrderName"]][productCode]["ProductCount"]:
                self.calling_data["Orders"][self.orders_status["currentOrderName"]][productCode]["CurrentQuantity"] += 1
                self.dbmanager.update_OrderData_counting(productCode, [self.orders_status["currentOrderName"]], dataHandler.calling_data)
                if self.calling_data["Orders"][self.orders_status["currentOrderName"]][productCode]["CurrentQuantity"] == self.calling_data["Orders"][self.orders_status["currentOrderName"]][productCode]["ProductCount"]:
                    self.orders_status["product"][productCode] = True
            else:
                self.orders_status["product"][productCode] = True
        self.check_AllOrderFull()
        if self.calling_data["isAllOrderFull"]:
            self.dbmanager.update_finish_status(self.calling_data["DateTimeIn"], self.calling_data["PlateNumber"])


    def classify_ConfuseData(self, data):
        cursorConfuseData = self.dbmanager.confuseCollection.find({"_id": data["_id"]})
        for documentConfuse in cursorConfuseData:
            documentConfuse

            cursorOrderData = self.dbmanager.orderCollection.find({"OrderName": data["OrderName"]})
            for documentOrder in cursorOrderData:
                if data["ProductCode"] in documentOrder["Orders"]:
                    if documentOrder["Orders"][data["ProductCode"]]["CurrentQuantity"] < \
                            documentOrder["Orders"][data["ProductCode"]]["ProductCount"]:
                        documentOrder["Orders"][data["ProductCode"]]["CurrentQuantity"] += 1


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

    def get_order_documents(self):
        data = {}
        for status in ["Waiting", "Finished"]:
            docs = []
            doc_dict = {}
            cursor = self.orderCollection.find({"Status": status})
            for document in cursor:
                document['_id'] = str(document['_id'])  # convert object_id from mongodb to string, then parse to json to send client
                date = document['DateTimeIn'].split('T')[0]
                plateNumber = document['PlateNumber']
                key = date + '_' + plateNumber
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
        print(dateTimeIn)
        data = []
        date = "^" + dateTimeIn.split('T')[0]   # for search regex all document have value start with date
        print(date)
        cursor = self.confuseCollection.find({"DateTimeIn": {"$regex": date}})
        print(cursor)
        for document in cursor:
            document['_id'] = str(document['_id'])  # convert object_id from mongodb to string, then parse to json to send client
            data.append(document)
        return data

    def get_documents_by_platenumber(self, plate_number):
        # Query the database
        date_time_dict = {}
        cursor = self.orderCollection.find({"PlateNumber": plate_number})
        for document in cursor:
            if document['Status'] == 'Waiting':
                date = document['DateTimeIn'].split('T')[0]
                if date not in date_time_dict:
                    document['_id'] = str(document['_id'])  # convert object_id from mongodb to string, then parse to json to send client
                    date_time_dict[date] = document
                else:
                    date_time_dict[date]['Orders'].extend(document['Orders'])
        return date_time_dict

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
              "DateTimeIn": data["DateTimeIn"],
              "CameraID": data["CameraID"],
              "PlateNumber": plateNumber,
              "OrderName": ordername,
              "Products": productCode_list,
              "Message": "Không nhận diện được",
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

    def update_OrderData_counting(self, productCode, orderNameList, calling_data):
        if calling_data["IsCombine"]:
            is_updated = False
            update_value =  calling_data["Orders"]["ordername"][productCode]["CurrentQuantity"]
            # update value follow priority of orderNameList
            for orderName in orderNameList:
                cursor = self.orderCollection.find({"OrderName": orderName})
                for document in cursor:
                    if productCode in document["Orders"]:
                        if document["Orders"][productCode]["CurrentQuantity"] < document["Orders"][productCode]["ProductCount"]:
                            data = copy.deepcopy(document["Orders"])
                            data["_id"] = copy.copy(document["_id"])
                            data[productCode]["CurrentQuantity"] = update_value
                            self.update_OrderData(data)
                            is_updated = True
                if is_updated:
                    break
        else:
            # update value directly to current orderName
            self.update_OrderData(calling_data["Orders"][orderNameList[0]])

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
        date = data['DateTimeIn'].split('T')[0]
        plateNumber = data['PlateNumber']
        key = date + '_' + plateNumber
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
        result["isAllOrderFull"] = False
        result["DateTimeIn"] = copy.copy(data['DateTimeIn'])
        result["PlateNumber"] = copy.copy(data['PlateNumber'])
        return result



dbmanager = DBManagerment(uri="mongodb+srv://quannguyen:quanmongo94@cluster0.b09slu1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", dbname="AFC", OrderCollection="OrderData", ConfuseCollection="ConfuseData")
dataHandler = CallingDataHandler(dbmanager)

# Upload image from phone to server
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

# Get image from server to TSTech app
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

# Send results from TSTech app to server
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

# Get OCR results from server to phone
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

# Get all data from mongodb to web
@app.route("/getOrderData", methods=['POST'])
def getOrderData():
    try:
        data = dbmanager.get_order_documents()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)})

# Get all data by plate number from mongodb to web
@app.route('/getDatabyPlateNumber', methods=['POST'])
def getDatabyPlateNumber():
    data = request.json
    # print(data)
    plate_number = data.get('PlateNumber')
    # print(plate_number)
    if not plate_number:
        return jsonify({"error": "PlateNumber is required"}), 400
    try:
        return jsonify(dbmanager.get_documents_by_platenumber(plate_number))
    except Exception as e:
        return jsonify({"error": str(e)})

# Get all data by status from mongodb to web
@app.route('/getDatabyStatus', methods=['POST'])
def getDatabyStatus():
    data = request.json
    status = data.get('Status')
    if not status:
        return jsonify({"error": "Status is required"}), 400
    try:
        return jsonify(dbmanager.get_documents_by_status(status))
    except Exception as e:
        return jsonify({"error": str(e)})

# Insert data to mongodb from web
@app.route('/insertData', methods=['POST'])
def insertData():
    isPush = False
    if request.method == 'POST':
        data = request.json
        isPush = dbmanager.insert_data(data)
    return jsonify(isPush)

# Sorting order when calling truck
@app.route('/sortingData', methods=['POST'])
def sortingData():
    data = request.json
    dataHandler.set_calling_data(dbmanager.orders_sorting(data))
    return jsonify(dataHandler.calling_data)

# Start counting order, if attach with image, not count but save it to confuse data
@app.route('/countingData', methods=['POST'])
def countingData():
    data = request.json
    if data['imageBase64'] == "":
        productCode = data["ProductCode"]
        dataHandler.counting(productCode)
    else:
        dbmanager.insert_ConfuseData(data, dataHandler.calling_data['PlateNumber'], dataHandler.orders_status['currentOrderName'], list(dataHandler.orders_status['product'].keys()))
    return jsonify(dataHandler.calling_data)

# Get list counting product
@app.route('/getListProductCode', methods=['POST'])
def getListProductCode():
    return jsonify(dataHandler.orders_status)

# Get confuse data
@app.route("/getConfuseData", methods=['POST'])
def getConfuseData():
    try:
        data = dbmanager.get_confuse_documents(dataHandler.calling_data["DateTimeIn"])
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)})

# Edit order data
@app.route("/updateOrderData", methods=['POST'])
def updateOrderData():
    data = request.json
    isUpdate = dbmanager.update_OrderData(data)
    return jsonify(isUpdate)

@app.route("/classifyConfuseData", methods=['POST'])
def classifyConfuseData():
    data = request.json
    isUpdate = dbmanager.classify_ConfuseData(data)
    return jsonify(isUpdate)


if __name__ == '__main__':
    app.run(host='192.168.100.164', port=5000)
