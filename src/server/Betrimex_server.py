
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app, resources={r"/updateData": {"origins": "http://localhost:3000"},
                     r"/getData": {"origins": "http://localhost:3000"},
                     r"/insertData": {"origins": "http://localhost:3000"}})

class DBManagerment():
    def __init__(self, uri, dbname) -> None:
        client = MongoClient(uri)
        dbs = client.list_database_names()
        print(dbs)
        try:
            self.db = client[dbname]
            self.userData_collections = self.db["users"]
            self.infoData_collections = self.db["data"]
        except Exception as e:
            print(e)

    def get_userData(self):
        docs = []
        cursor = self.userData_collections.find({})
        for document in cursor:
            document['_id'] = str(document['_id'])  # convert object_id from mongodb to string, then parse to json to send client
            docs.append(document)
        return docs

    def get_infoData(self, query):
        docs = []
        if not query:
            cursor = self.infoData_collections.find()
        else:
            cursor = self.infoData_collections.find(query)
        for document in cursor:
            document['_id'] = str(document['_id'])  # convert object_id from mongodb to string, then parse to json to send client
            docs.append(document)
        return docs
    
    def update_infoData(self, documentId, updateField):
        # Perform the update operation
        result = self.infoData_collections.update_one({"_id": ObjectId(documentId)}, {"$set": updateField})
        # Check if the document was updated
        if result.matched_count > 0:
            print("Document updated successfully")
            return True
        else:
            print("Document not found")
            return False
        
    def insert_infoData(self, data):
        # Perform the insert operation
        result = self.infoData_collections.insert_one(data)
        # Check if the document was inserted
        if result.inserted_id:
            print("Document insert successfully")
            return True
        else:
            print("Document insert failed")
            return False

dbmanager = DBManagerment(uri="mongodb+srv://quannguyen:quanmongo94@cluster0.b09slu1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", dbname="Betrimex")

# Check user login data
@app.route("/checkLogin")
def checkLogin():
    auth = request.authorization
    print(auth.username, auth.password)
    print(dbmanager.get_userData())
    users = dbmanager.get_userData()[0]
    print(users)
    if (auth.username == users['username']) and (auth.password == users['password']):
        return jsonify({"status": "ok"})
    else:
        return jsonify({"error": "Unauthorized"}), 401

# Get data
@app.route("/getData", methods=["POST"])
def getData():
    if request.method == 'POST':
        query = request.json
    data = dbmanager.get_infoData(query)
    return jsonify(data)

# Update data
@app.route("/updateData", methods=["POST"])
def updateData():
    isUpdate = False
    if request.method == 'POST':
        query = request.json
        if len(query) > 0:
            documentId = query.get('documentId', '')
            updateFields  = query.get('updateFields', {})   # update_fields = {"address": "Can Tho", "quantity": "20"}
            isUpdate = dbmanager.update_infoData(documentId, updateFields)
    return jsonify(isUpdate)

# Update data
@app.route("/insertData", methods=["POST"])
def insertData():
    isPush = False
    if request.method == 'POST':
        data = request.json
        isPush = dbmanager.insert_infoData(data)
    return jsonify(isPush)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
