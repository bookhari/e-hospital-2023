from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import pickle

app = Flask(__name__)  # See here
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route("/get_my_ip", methods=["GET"])
def get_my_ip():
    return jsonify({'ip': request.remote_addr}), 200


@app.route("/predict_liver_disease", methods=["POST"])
@cross_origin()
def predict_liver_disease():
    data = request.json
    print(data)
    loaded_model = pickle.load(open('finalized_model.sav', 'rb'))
    try:
        input = [[
            float(data['age']),
            float(data['tb']),
            float(data['db']),
            float(data['ap']),
            float(data['aa1']),
            float(data['aa2']),
            float(data['tp']),
            float(data['al']),
            float(data['ag']),
            1 if data['gender'] == 'female' else 0,
            1 if data['gender'] == 'male' else 1
        ]]
        res = loaded_model.predict(input)[0]
        return "Potential liver disease detected, further examination required." if res == 1 else "No liver disease " \
                                                                                                 "detected. "
    except:
        return "input error"


if __name__ == '__main__':
    app.run(port=5002, debug=True)
