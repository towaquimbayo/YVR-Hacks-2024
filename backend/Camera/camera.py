import time

import cv2

height = 720   # for some reason, ANYTHING else works for my HD camera for example 1079..
width = 1280


class CameraStream:
    def __init__(self, stream_link=None):
        if stream_link is not None:
            self.cap = cv2.VideoCapture(stream_link)
        else:
            self.cap = cv2.VideoCapture(0)
            self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, width)
            self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, height)
        self.count = 1

    def get_frame(self):
        success, frame = self.cap.read()
        # self._save_frame(frame)
        return success, frame

    def _save_frame(self, frame):
        self.count += 1
        if self.count % 30 == 0:
            # Save the frame to a file
            print("self.count", self.count)
            cv2.imwrite(f"{time.time()}.jpg", frame)

    @property
    def is_cap_opened(self):
        return self.cap.isOpened()

    def release(self):
        self.cap.release()
