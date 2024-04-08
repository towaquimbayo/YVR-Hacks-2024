from ultralytics import YOLO
from ultralytics.solutions.object_counter import ObjectCounter

region_points = [(0, 0), (0, 720), (1280, 720), (1280, 0)]


class YVRModel:

    def __init__(self):
        self.counter = ObjectCounter()
        self.model = YOLO("yolov8n.pt")
        self._init()

    def _init(self):
        self.counter.set_args(view_img=True,
                                     reg_pts=region_points,
                                     classes_names=self.model.names,
                                     draw_tracks=True,
                                     line_thickness=2)

    def get_tagged_image(self, image_to_tag):
        tracks = self.model.track(image_to_tag, persist=True, show=False, classes=[0, 63])
        image = self.object_counter.start_counting(image_to_tag, tracks)
        return image
