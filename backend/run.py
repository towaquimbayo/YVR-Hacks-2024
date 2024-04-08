from flask import Flask, Response
import cv2

from counting import TaggedImage

app = Flask(__name__)

tagger = TaggedImage()
camera = cv2.VideoCapture(0)


def generate_frames():
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            tagged_image = tagger.get_tagged_frame(frame)
            ret, buffer = cv2.imencode('.jpg', tagged_image)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


def regular_stream():
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route('/regular')
def regular():
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
