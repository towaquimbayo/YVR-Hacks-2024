import sqlite3

from flask import Flask, Response, jsonify
import cv2
from AI.yrv_model import YVRModel
from Camera.camera import CameraStream
from db import Db

app = Flask(__name__)
db = Db()

model = YVRModel(db)
camera = CameraStream()


def generate_frames():
    while True:
        success, frame = camera.get_frame()
        if not success:
            break
        else:
            tagged_image = model.get_tagged_image(frame)
            ret, buffer = cv2.imencode('.jpg', tagged_image)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


def regular_stream():
    while True:
        success, frame = camera.get_frame()
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route('/regular')
def regular():
    """
    Return untagged camera stream.

    This is in
    """
    print("YOU REQUESTING THE UNTAGGED CAMERA STREAM FROM FLASK, IT MAY THROTTLE")
    return Response(regular_stream(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/video')
def video():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


def get_db_connection():
    conn = sqlite3.connect('yvr_hack.db')
    conn.row_factory = sqlite3.Row
    return conn


@app.route('/get_timestamps')
def get_timestamps():
    # Create a new database connection
    conn = get_db_connection()
    cursor = conn.cursor()

    # Retrieve all data from the counts table
    cursor.execute("SELECT * FROM counts")
    rows = cursor.fetchall()

    # Close the database connection
    conn.close()

    # Convert the rows to a list of dictionaries
    counts = []
    for row in rows:
        counts.append({
            'timestamp': row['timestamp'],
            'in_count': row['in_count'],
            'out_count': row['out_count']
        })

    # Return the counts as JSON
    return jsonify(counts)


@app.route('/')
def home():
    return "<h1>Home</h1>"


if __name__ == '__main__':
    app.run(debug=True)
