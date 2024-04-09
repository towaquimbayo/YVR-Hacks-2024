import time

from ultralytics import YOLO

from AI.yvr_object_counter import YVRObjectCounter

region_points = [(40, 200), (40, 350), (1200, 450), (1200, 150)]


class YVRModel:

    def __init__(self, db):
        self.counter = YVRObjectCounter()
        self.model = YOLO("yolov8n.pt")
        self._init()
        self.time_start = time.time()
        self.database = db

    def _init(self):
        self.counter.set_args(view_img=True,
                              reg_pts=region_points,
                              classes_names=self.model.names,
                              draw_tracks=True,
                              line_thickness=2)

    def get_tagged_image(self, image_to_tag):
        tracks = self.model.track(image_to_tag, persist=True, show=False)
        image = self.counter.start_counting(image_to_tag, tracks)
        if time.time() - self.time_start >= 20:
            self.time_start = time.time()
            self.write_to_database()
        return image

    def write_to_database(self):
        person_count = self.counter.class_wise_count.get("perso")
        if person_count is not None:
            in_count, out_count = person_count['in'], person_count['out']
            self.database.do_query(in_count, out_count)
            self.counter.reset_object_counter("perso")
