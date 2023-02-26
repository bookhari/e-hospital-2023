from flask import Flask, request, jsonify, render_template, make_response
from flask_cors import CORS, cross_origin
import pickle
from flask_mysqldb import MySQL
import pandas as pd
import matplotlib.pyplot as plt
import io
import base64

import mysql.connector




app = Flask(__name__)  # See here
# app.config['MYSQL_HOST'] = 'localhost' # Replace with your host
# app.config['MYSQL_USER'] = 'root' # Replace with your MySQL username
# app.config['MYSQL_PASSWORD'] = '123456' # Replace with your MySQL password
# app.config['MYSQL_DB'] = 'eHospital' # Replace with your MySQL database name


app.config['MYSQL_HOST'] = 'us-cdbr-east-06.cleardb.net' # Replace with your host
app.config['MYSQL_USER'] = 'b05e8c26aca707' # Replace with your MySQL username
app.config['MYSQL_PASSWORD'] = 'b1ead699' # Replace with your MySQL password
app.config['MYSQL_DB'] = 'heroku_6f03eb70d098e57' # Replace with your MySQL database name



mysql = MySQL(app)
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route("/get_my_ip", methods=["GET"])
def get_my_ip():
    return jsonify({'ip': request.remote_addr}), 200


@app.route("/liver_graph", methods=["GET"])
def graph():
    cur = mysql.connection.cursor()
    query = "SELECT age, gender, COUNT(*) FROM liver WHERE prediction='yes' GROUP BY age, gender"
    cur.execute(query)
    results = cur.fetchall()
    df = pd.DataFrame(results, columns=['age', 'gender', 'count'])
    df_pivot = df.pivot(index='age', columns='gender', values='count')
    fig, ax = plt.subplots()
    df_pivot.plot(kind='bar', ax=ax)
    ax.set_xlabel('Age')
    ax.set_ylabel('Count of "Prediction Yes"')
    ax.set_title('Prediction Yes by Age and Gender')
    buf = io.BytesIO()
    fig.savefig(buf, format='png')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode('ascii')
    response = img_base64
    # response.headers['Content-Type'] = 'text/html'
    return response

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

        cur = mysql.connection.cursor()
        query = "INSERT INTO liver (" \
                "name, " \
                "age, " \
                "gender, " \
                "total_bilirubin, " \
                "direct_bilirubin, " \
                "alkaline_phosphatase, " \
                "alanine_aminotransferase, " \
                "aspartate_aminotransferase, " \
                "total_proteins, " \
                "albumin, " \
                "albumin_and_globulin_ratio, " \
                "prediction) " \
                "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
        values = (
        data['name'], data['age'], data['gender'], data['tb'], data['db'], data['ap'], data['aa1'], data['aa2'],
        data['tp'], data['al'], data['ag'], "yes" if res == 1 else "no")
        cur.execute(query, values)
        mysql.connection.commit()
        cur.close()

        return "Potential liver disease detected, further examination required." if res == 1 else "No liver disease detected."
    except Exception as e:
        print("Error: {}".format(str(e)))
        return "input error"


if __name__ == '__main__':
    app.run(port=5002, debug=True)
