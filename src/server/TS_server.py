import requests
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)

def merge_data(docs):
    new_docs = {}
    for doc in docs:
        key = doc['date'] + '_' + doc['license_plate']
        if key not in new_docs:
            new_docs[key] = {'date': doc['date'],
                             'license_plate': doc['license_plate'],
                             'orderslist': doc['orderslist']}
        else:
            for order_key, order_value in doc['orderslist'].items():
                if order_key not in new_docs[key]['orderslist']:
                    new_docs[key]['orderslist'][order_key] = order_value
                else:
                    for good_key, good_value in doc['orderslist'][order_key].items():
                        if good_key not in new_docs[key]['orderslist'][order_key]:
                            new_docs[key]['orderslist'][order_key][good_key] = good_value
                        else:
                            new_docs[key]['orderslist'][order_key][good_key] += good_value

    merge_docs = []
    for idx, (key, value) in enumerate(new_docs.items()):
        value['idx'] = idx
        merge_docs.append(value)

    return merge_docs

def get_data_by_lisence_plate(docs, lisenceplate):
    filter_docs = []
    for doc in docs:
        if doc['license_plate'] == lisenceplate:
            filter_docs.append(doc)
    return filter_docs

# Members API Route
@app.route("/getData")
@cross_origin()
def getData():
    url = 'http://localhost:5000/returnData'    # get data from AFC server
    response = requests.get(url)
    merge_docs = merge_data(response.json())

    try:
        if response.status_code == 200:
            return jsonify({"data": merge_docs})
        else:
            return jsonify({"error": "Failed to fetch data"}), 500
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route("/getDatabyLisencePlate")
@cross_origin()
def getDatabyLisencePlate():
    lisenceplate = request.args['lisenceplate'] # must send lisenceplate along to request api url
    print(lisenceplate)
    url = 'http://localhost:5000/returnData'    # get data from AFC server
    response = requests.get(url)
    merge_docs = merge_data(response.json())
    filter_docs = get_data_by_lisence_plate(merge_docs, lisenceplate)

    try:
        if response.status_code == 200:
            return jsonify({"data": filter_docs})
        else:
            return jsonify({"error": "Failed to fetch data"}), 500
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True, host='192.168.100.164', port=4000)