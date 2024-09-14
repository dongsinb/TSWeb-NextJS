# app.py
from flask import Flask, request, Response, jsonify, send_file
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
import numpy as np
import cv2
import io
import base64
import copy

app = Flask(__name__)
CORS(app, resources={r"/upload_img": {"origins": "http://localhost:3000"},
                     r"/get_img": {"origins": "http://localhost:3000"}})

global_image = None
ocr_results = None

class DBManagerment():
    def __init__(self, uri, dbname, collectionname) -> None:
        client = MongoClient(uri)
        try:
            self.db = client[dbname]
            self.collection = self.db[collectionname]
            self.waiting_orders = {}
        except Exception as e:
            print(e)

    def get_all_documents(self):
        data = {}
        for status in ["Waiting", "Called", "Finished"]:
            docs = []
            doc_dict = {}
            cursor = self.collection.find({"Status": status})
            for document in cursor:
                document['_id'] = str(document['_id'])  # convert object_id from mongodb to string, then parse to json to send client
                date = document['DateTimeIn'].split('T')[0]
                plateNumber = document['PlateNumber']
                key = date + '_' + plateNumber
                if key not in doc_dict:
                    doc_dict[key] = copy.deepcopy(document)
                    doc_dict[key]["Orders"] = []
                    order_dict = {document["OrderName"] : copy.deepcopy(document["Orders"])}
                    doc_dict[key]["Orders"].append(order_dict)
                    doc_dict[key].pop('OrderName', None)
                    doc_dict[key].pop('Status', None)
                else:
                    order_dict = {document["OrderName"] : copy.deepcopy(document["Orders"])}
                    doc_dict[key]["Orders"].append(order_dict)
            if doc_dict:
                for k, v in doc_dict.items():
                    docs.append(v)
            data[status] = docs
            if status == "Waiting":
                self.waiting_orders = copy.deepcopy(doc_dict)
        return data

    def get_documents_by_platenumber(self, plate_number):
        # Query the database
        date_time_dict = {}
        cursor = self.collection.find({"PlateNumber": plate_number})
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
        cursor = self.collection.find({"Status": status})
        for document in cursor:
            print(document)
            document['_id'] = str(document['_id'])  # convert object_id from mongodb to string, then parse to json to send client
            docs.append(document)
        return docs

    def insert_data(self, data):
        # Perform the insert operation
        result = self.collection.insert_one(data)
        # Check if the document was inserted
        if result.inserted_id:
            print("Document insert successfully")
            return True
        else:
            print("Document insert failed")
            return False

    def orders_sorting(self, data):
        sortList = data["SortList"]
        isCombine = data["IsCombine"]
        date = data['DateTimeIn'].split('T')[0]
        plateNumber = data['PlateNumber']
        key = date + '_' + plateNumber
        orders = self.waiting_orders[key]["Orders"]
        if isCombine:
            sorted_orders = [{"order":[]}]
            order_combine = {}
            for order in orders:
                order_info = list(order.values())[0]
                for info in order_info:
                    code = info["ProductCode"]
                    if code not in order_combine:
                        order_combine[code] = copy.deepcopy(info)
                    else:
                        order_combine[code]["ProductCount"] += info["ProductCount"]
                        order_combine[code]["CurrentQuantity"] += info["CurrentQuantity"]
            for info in order_combine.values():
                sorted_orders[0]["order"].append(info)
        else:
            sorted_orders = [None] * len(sortList)
            for i in range(len(sortList)):
                order = orders[i]
                orderName = list(order.keys())[0]
                idx = sortList.index(orderName)
                sorted_orders[idx] = copy.deepcopy(order)
        result = copy.deepcopy(self.waiting_orders[key])
        result["Orders"] = sorted_orders
        return result


dbmanager = DBManagerment(uri="mongodb+srv://quannguyen:quanmongo94@cluster0.b09slu1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", dbname="AFC", collectionname="OrderData")

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
        print(ocr_results)
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
@app.route("/getAllData", methods=['POST'])
def getAllData():
    try:
        data = dbmanager.get_all_documents()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)})

# Get all data by plate number from mongodb to web
@app.route('/getDatabyPlateNumber', methods=['POST'])
def getDatabyPlateNumber():
    data = request.json
    print(data)
    plate_number = data.get('PlateNumber')
    print(plate_number)
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
    print(status)
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

# Start counting order when calling truck
@app.route('/countingData', methods=['POST'])
def countingData():
    data = request.json
    print(data)
    return jsonify(dbmanager.orders_sorting(data))

if __name__ == '__main__':
    app.run(host='192.168.100.164', port=5000)
