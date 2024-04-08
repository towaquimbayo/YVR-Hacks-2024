import cv2


class CameraStream:
    def __init__(self, stream_link=None):
        if stream_link is not None:
            self.cap = cv2.VideoCapture(stream_link)
        else:
            self.cap = cv2.VideoCapture(0)

    def get_frame(self):
        success, frame = self.cap.read()
        return success, frame

    @property
    def is_cap_opened(self):
        return self.cap.isOpened()
