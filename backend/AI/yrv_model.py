import time

from ultralytics import YOLO

from AI.yvr_object_counter import YVRObjectCounter

region_points = [(570, 360), (550, 400), (750, 250)]

custom_names = {
    0: 'person',
    28: 'suitcase'

}


class YVRModel:

    def __init__(self, db):
        self.counter = YVRObjectCounter(db)
        self.model = YOLO("yolov8n.pt")
        self._init()
        self.time_start = time.time()
        self.database = db

    def _init(self):
        self.counter.set_args(view_img=True,
                              reg_pts=region_points,
                              classes_names=custom_names,
                              draw_tracks=True,
                              line_thickness=2)

    def get_tagged_image(self, image_to_tag):
        tracks = self.model.track(image_to_tag, persist=True, show=False, classes=[0, 28])
        image = self.counter.start_counting(image_to_tag, tracks)
        # self.get_count_information()
        if time.time() - self.time_start >= 20:
            self.time_start = time.time()
            self.write_to_database()
        return image

    def write_to_database(self):
        person_count = self.counter.class_wise_count.get("perso")
        if person_count is not None:
            in_count, out_count = person_count['in'], person_count['out']
            if in_count != 0 or out_count != 0:
                print("adding count")
                self.database.add_count(in_count, out_count)
                self.counter.reset_object_counter("perso")

    def get_count_information(self):
        print("object ids", self.counter.count_ids)
