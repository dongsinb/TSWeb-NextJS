
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo.mongo_client import MongoClient

app = Flask(__name__)
CORS(app)

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

dbmanager = DBManagerment(uri="mongodb+srv://quannguyen:quanmongo94@cluster0.b09slu1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", dbname="Betrimex")

# Check user login data
@app.route("/checkLogin")
def checkLogin():
    auth = request.authorization
    print(auth.username, auth.password)
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


if __name__ == '__main__':
    app.run(debug=True, port=5000)
