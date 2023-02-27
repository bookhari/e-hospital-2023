from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import pickle
import pandas as pd
import matplotlib.pyplot as plt
import io
import base64
import mysql.connector




app = Flask(__name__)  # See here


# mysql = MySQL(app)
CORS(app, resources={r"/*": {"origins": "*"}})

cnx = mysql.connector.connect(
    host='us-cdbr-east-06.cleardb.net',
    user='b05e8c26aca707',
    password='b1ead699',
    database='heroku_6f03eb70d098e57'
)


@app.route("/get_my_ip", methods=["GET"])
def get_my_ip():
    return jsonify({'ip': request.remote_addr}), 200


@app.route("/liver_graph", methods=["GET"])
def graph():
    cnx = mysql.connector.connect(
        host='us-cdbr-east-06.cleardb.net',
        user='b05e8c26aca707',
        password='b1ead699',
        database='heroku_6f03eb70d098e57'
    )
    cursor = cnx.cursor()
    query = "SELECT age, gender, COUNT(*) FROM liver WHERE prediction='yes' GROUP BY age, gender"
    cursor.execute(query)
    results = cursor.fetchall()
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

        # cur = mysql.connection.cursor()
        cursor = cnx.cursor()




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
        cursor.execute(query, values)
        cnx.commit()
        cursor.close()
        cnx.close()

        return "Potential liver disease detected, further examination required." if res == 1 else "No liver disease detected."
    except Exception as e:
        print("Error: {}".format(str(e)))
        return "input error"


if __name__ == '__main__':
    app.run(port=8081)
