from flask import Flask, Response
import cv2
from AI.yrv_model import YVRModel
from Camera.camera import CameraStream

app = Flask(__name__)

model = YVRModel()
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


@app.route('/')
def home():
    return "<h1>Home</h1>"


if __name__ == '__main__':
    app.run(debug=True)
