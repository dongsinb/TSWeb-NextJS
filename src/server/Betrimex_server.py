
from flask import Flask, jsonify
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

app = Flask(__name__)

class DBManagerment():
    def __init__(self, uri, dbname, collectionname) -> None:
        client = MongoClient(uri)
        dbs = client.list_database_names()
        print(dbs)
        try:
            self.db = client[dbname]
            self.collection = self.db[collectionname]
        except Exception as e:
            print(e)

    def get_all_documents(self):
        docs = []
        cursor = self.collection.find({})
        for document in cursor:
            document['_id'] = str(document['_id'])  # convert object_id from mongodb to string, then parse to json to send client
            docs.append(document)
        return docs

dbmanager = DBManagerment(uri="mongodb+srv://quannguyen:quanmongo94@cluster0.b09slu1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", dbname="Betrimex", collectionname="users")

# Members API Route
@app.route("/returnData")
def returnData():
    try:
        return jsonify(dbmanager.get_all_documents())
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
