import base64
import sqlite3
import time
from datetime import datetime

from flask_cors import CORS, cross_origin
import numpy as np
from flask import Flask, Response, jsonify
import cv2
from AI.yrv_model import YVRModel
from Camera.camera import CameraStream
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from constants import CAMERA_BCIT, FILE_LINK

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes and methods
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///yvr_hack.db"

db = SQLAlchemy(app)
migrate = Migrate(app, db)


class Counts(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.Text, default=datetime.utcnow)
    in_count = db.Column(db.Integer, nullable=False)
    out_count = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f"Counts(id={self.id}, timestamp={self.timestamp}, in_count={self.in_count}, out_count={self.out_count})"


class Incident(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image = db.Column(db.BLOB, nullable=False)
    object = db.Column(db.Text, nullable=False)
    time_unattended = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    location = db.Column(db.Text, nullable=False)  # Assuming location can be nullable
    priority = db.Column(db.Integer, nullable=False, default=0)  # Assuming priority is an integer
    is_resolved = db.Column(db.Boolean, nullable=False, default=False)  # Assuming is_resolved is a boolean
    category = db.Column(db.Text, nullable=True, default=False)

    def __repr__(self):
        return f"Incident(id={self.id}, object={self.object}, time_unattended={self.time_unattended})"

    def save_image(self, cv_image):
        # Convert the OpenCV image to a byte array
        cv2.imwrite(time.time(), cv_image)
        _, image_buffer = cv2.imencode('.jpg', cv_image)
        image_bytes = image_buffer.tobytes()

        # Store the byte array in the database
        self.image = image_bytes

    def get_image(self):
        # Convert the byte array back to an OpenCV image
        image_array = np.frombuffer(self.image, dtype=np.uint8)
        cv_image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
        return cv_image


class DatabaseOperation:
    def __init__(self, dab):
        self.db = dab

    def add_count(self, count_in, count_out):
        with app.app_context():
            try:
                counts_entry = Counts(in_count=count_in, out_count=count_out)
                self.db.session.add(counts_entry)
                self.db.session.commit()
                print("Count added successfully.")
            except Exception as e:
                print("Error adding count:", e)

    def add_incident(self, image, object, time, location="camera1", priority=0, is_resolved=False,
                     category="Left Over Item"):
        with app.app_context():
            try:
                incident = Incident(object=object, time_unattended=time, location=location, priority=priority,
                                    is_resolved=is_resolved, category=category)
                incident.save_image(image)
                self.db.session.add(incident)
                self.db.session.commit()
                print("Incident added successfully.")
            except Exception as e:
                print("Error adding incident:", e)


dbo = DatabaseOperation(db)

model = YVRModel(dbo)
camera = CameraStream(stream_link=CAMERA_BCIT)


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
@cross_origin()
def video():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


def get_db_connection():
    conn = sqlite3.connect('yvr_hack.db')
    conn.row_factory = sqlite3.Row
    return conn


@app.route('/get_counts')
def get_timestamps():
    # Retrieve all data from the counts table
    counts = Counts.query.all()

    # Convert the counts objects to a list of dictionaries
    counts_list = []
    for count in counts:
        counts_list.append({
            'id': count.id,
            'timestamp': count.timestamp,
            'in_count': count.in_count,
            'out_count': count.out_count
        })

    # Return the counts as JSON
    return jsonify(counts_list)


@app.route('/get_incidents')
def get_incidents():
    incidents = Incident.query.all()

    # Convert the incidents to a list of dictionaries
    incidents_list = []
    for incident in incidents:
        incidents_list.append({
            'id': incident.id,
            'image': base64.b64encode(incident.image).decode('utf-8'),  # Convert the byte object to base64 string
            'object': incident.object,
            'time_unattended': incident.time_unattended.strftime('%Y-%m-%d %H:%M:%S'),
            'location': incident.location,  # Added as per the model
            'priority': incident.priority,  # Assuming you want to include this as is
            'is_resolved': incident.is_resolved,  # Assuming you want to include this as is
            'category': incident.category
        })

    # Return the incidents as JSON
    return jsonify(incidents_list)


@app.route('/')
def home():
    return "<h1>Home</h1>"


with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
