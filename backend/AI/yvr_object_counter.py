# Ultralytics YOLO 🚀, AGPL-3.0 license
import time
from collections import defaultdict
from datetime import datetime

import cv2

from ultralytics.utils.checks import check_imshow, check_requirements
from ultralytics.utils.plotting import Annotator, colors

check_requirements("shapely>=2.0.0")

from shapely.geometry import LineString, Point, Polygon


class YVRObjectCounter:
    """A class to manage the counting of objects in a real-time video stream based on their tracks."""

    def __init__(self, db):
        """Initializes the Counter with default values for various tracking and counting parameters."""

        # databse
        self.db = db
        # Mouse events
        self.is_drawing = False
        self.selected_point = None

        # Region & Line Information
        self.reg_pts = [(20, 400), (1260, 400)]
        self.line_dist_thresh = 15
        self.counting_region = None
        self.region_color = (255, 0, 255)
        self.region_thickness = 5

        # Image and annotation Information
        self.im0 = None
        self.tf = None
        self.view_img = False
        self.view_in_counts = True
        self.view_out_counts = True

        self.names = None  # Classes names
        self.annotator = None  # Annotator
        self.window_name = "Ultralytics YOLOv8 Object Counter"

        # Object counting Information
        self.in_counts = 0
        self.out_counts = 0
        self.count_ids = []
        self.class_wise_count = {}
        self.count_txt_thickness = 0
        self.count_txt_color = (255, 255, 255)
        self.count_bg_color = (255, 255, 255)
        self.cls_txtdisplay_gap = 50
        self.fontsize = 0.6

        # Tracks info
        self.track_history = defaultdict(list)
        self.track_thickness = 2
        self.draw_tracks = False
        self.track_color = None

        # Check if environment support imshow
        self.env_check = check_imshow(warn=True)

        # list of object need to track stationary
        self.stationary_objects = {
            0: [],
            28: []
        }

    def set_args(
            self,
            classes_names,
            reg_pts,
            count_reg_color=(255, 0, 255),
            count_txt_color=(0, 0, 0),
            count_bg_color=(255, 255, 255),
            line_thickness=2,
            track_thickness=2,
            view_img=False,
            view_in_counts=True,
            view_out_counts=True,
            draw_tracks=False,
            track_color=None,
            region_thickness=5,
            line_dist_thresh=15,
            cls_txtdisplay_gap=50,
    ):
        """
        Configures the Counter's image, bounding box line thickness, and counting region points.

        Args:
            line_thickness (int): Line thickness for bounding boxes.
            view_img (bool): Flag to control whether to display the video stream.
            view_in_counts (bool): Flag to control whether to display the incounts on video stream.
            view_out_counts (bool): Flag to control whether to display the outcounts on video stream.
            reg_pts (list): Initial list of points defining the counting region.
            classes_names (dict): Classes names
            track_thickness (int): Track thickness
            draw_tracks (Bool): draw tracks
            count_txt_color (RGB color): count text color value
            count_bg_color (RGB color): count highlighter line color
            count_reg_color (RGB color): Color of object counting region
            track_color (RGB color): color for tracks
            region_thickness (int): Object counting Region thickness
            line_dist_thresh (int): Euclidean Distance threshold for line counter
            cls_txtdisplay_gap (int): Display gap between each class count
        """
        self.tf = line_thickness
        self.view_img = view_img
        self.view_in_counts = view_in_counts
        self.view_out_counts = view_out_counts
        self.track_thickness = track_thickness
        self.draw_tracks = draw_tracks

        # Region and line selection
        if len(reg_pts) == 2:
            print("Line Counter Initiated.")
            self.reg_pts = reg_pts
            self.counting_region = LineString(self.reg_pts)
        elif len(reg_pts) >= 3:
            print("Polygon Counter Initiated.")
            self.reg_pts = reg_pts
            self.counting_region = Polygon(self.reg_pts)
        else:
            print("Invalid Region points provided, region_points must be 2 for lines or >= 3 for polygons.")
            print("Using Line Counter Now")
            self.counting_region = LineString(self.reg_pts)

        self.names = classes_names
        self.track_color = track_color
        self.count_txt_color = count_txt_color
        self.count_bg_color = count_bg_color
        self.region_color = count_reg_color
        self.region_thickness = region_thickness
        self.line_dist_thresh = line_dist_thresh
        self.cls_txtdisplay_gap = cls_txtdisplay_gap

    def mouse_event_for_region(self, event, x, y, flags, params):
        """
        This function is designed to move region with mouse events in a real-time video stream.

        Args:
            event (int): The type of mouse event (e.g., cv2.EVENT_MOUSEMOVE, cv2.EVENT_LBUTTONDOWN, etc.).
            x (int): The x-coordinate of the mouse pointer.
            y (int): The y-coordinate of the mouse pointer.
            flags (int): Any flags associated with the event (e.g., cv2.EVENT_FLAG_CTRLKEY,
                cv2.EVENT_FLAG_SHIFTKEY, etc.).
            params (dict): Additional parameters you may want to pass to the function.
        """
        if event == cv2.EVENT_LBUTTONDOWN:
            for i, point in enumerate(self.reg_pts):
                if (
                        isinstance(point, (tuple, list))
                        and len(point) >= 2
                        and (abs(x - point[0]) < 10 and abs(y - point[1]) < 10)
                ):
                    self.selected_point = i
                    self.is_drawing = True
                    break

        elif event == cv2.EVENT_MOUSEMOVE:
            if self.is_drawing and self.selected_point is not None:
                self.reg_pts[self.selected_point] = (x, y)
                self.counting_region = Polygon(self.reg_pts)

        elif event == cv2.EVENT_LBUTTONUP:
            self.is_drawing = False
            self.selected_point = None

    def extract_and_process_tracks(self, tracks):
        """Extracts and processes tracks for object counting in a video stream."""

        # Annotator Init and region drawing
        self.annotator = Annotator(self.im0, self.tf, self.names)

        # Draw region or line
        self.annotator.draw_region(reg_pts=self.reg_pts, color=self.region_color, thickness=self.region_thickness)

        if tracks[0].boxes.id is not None:
            boxes = tracks[0].boxes.xyxy.cpu()
            clss = tracks[0].boxes.cls.cpu().tolist()
            track_ids = tracks[0].boxes.id.int().cpu().tolist()

            # Extract tracks
            for box, track_id, cls in zip(boxes, track_ids, clss):
                print("track_id", track_id)
                print("cls", self.names[cls])
                # Draw bounding box
                self.annotator.box_label(box, label=f"{self.names[cls]}#{track_id}",
                                         color=colors(int(track_id), True))

                # Store class info
                if self.names[cls] not in self.class_wise_count:
                    if len(self.names[cls]) > 5:
                        self.names[cls] = self.names[cls][:5]
                    self.class_wise_count[self.names[cls]] = {"in": 0, "out": 0}

                # Draw Tracks
                track_line = self.track_history[track_id]
                track_line.append((float((box[0] + box[2]) / 2), float((box[1] + box[3]) / 2)))
                print(cls, "Cls")
                if cls == 28:
                    person_case_list = self.stationary_objects.get(cls, [])
                    current_track_id = [person for person in person_case_list if person["track_id"] == track_id]
                    if current_track_id:
                        if current_track_id[0]["prev_point"] == (int(track_line[-1][0]), int(track_line[-1][0])):
                            if time.time() - float(current_track_id[0]["time"]) >= 10:
                                print("adding suitcase")
                                self.db.add_incident(self.im0, "suitcase", datetime.utcnow())
                                # Correctly using filter to remove an item, converting filter object to a list
                                new_list = list(filter(lambda person: person["track_id"] != track_id, person_case_list))
                                self.stationary_objects[cls] = new_list
                        else:
                            # Properly updating 'prev_point' for the matching person
                            for person in person_case_list:
                                if person["track_id"] == track_id:
                                    person["prev_point"] = (int(track_line[-1][0]), int(track_line[-1][0]))
                                    # Assuming you want to update the time as well
                                    person["time"] = time.time()
                            # No need to assign it back to self.stationary_objects["person"]
                            # because we modified the list in place
                    else:
                        person_object = {
                            "track_id": track_id,
                            "prev_point": (int(track_line[-1][0]), int(track_line[-1][0])),
                            "time": time.time()
                        }
                        person_case_list.append(person_object)
                        self.stationary_objects["person"] = person_case_list
                if cls == -1:
                    person_case_list = self.stationary_objects.get("person", [])
                    current_track_id = [person for person in person_case_list if person["track_id"] == track_id]

                    if current_track_id:
                        if current_track_id[0]["prev_point"] == track_line[-1]:
                            if time.time() - float(current_track_id[0]["time"]) >= 10:
                                print(track_id, "is the stationary")
                                # Correctly using filter to remove an item, converting filter object to a list
                                new_list = list(filter(lambda person: person["track_id"] != track_id, person_case_list))
                                self.stationary_objects["person"] = new_list
                        else:
                            # Properly updating 'prev_point' for the matching person
                            for person in person_case_list:
                                if person["track_id"] == track_id:
                                    person["prev_point"] = track_line[-1]
                                    # Assuming you want to update the time as well
                                    person["time"] = time.time()
                            # No need to assign it back to self.stationary_objects["person"]
                            # because we modified the list in place
                    else:
                        person_object = {
                            "track_id": track_id,
                            "prev_point": track_line[-1],
                            "time": time.time()
                        }
                        person_case_list.append(person_object)
                        self.stationary_objects["person"] = person_case_list  # Correctly assign the updated list
            if len(track_line) > 30:
                track_line.pop(0)

                # Draw track trails
            if self.draw_tracks:
                self.annotator.draw_centroid_and_tracks(
                    track_line,
                    color=self.track_color if self.track_color else colors(int(track_id), True),
                    track_thickness=self.track_thickness,
                )

            prev_position = self.track_history[track_id][-2] if len(self.track_history[track_id]) > 1 else None

            # Count objects in any polygon
            if len(self.reg_pts) >= 3:
                is_inside = self.counting_region.contains(Point(track_line[-1]))

                if prev_position is not None and is_inside and track_id not in self.count_ids:
                    self.count_ids.append(track_id)

                    if (box[0] - prev_position[0]) * (self.counting_region.centroid.x - prev_position[0]) > 0:
                        self.in_counts += 1
                        self.class_wise_count[self.names[cls]]["in"] += 1
                    else:
                        self.out_counts += 1
                        self.class_wise_count[self.names[cls]]["out"] += 1

            # Count objects using line
            elif len(self.reg_pts) == 2:
                if prev_position is not None and track_id not in self.count_ids:
                    distance = Point(track_line[-1]).distance(self.counting_region)
                    if distance < self.line_dist_thresh and track_id not in self.count_ids:
                        self.count_ids.append(track_id)

                        if (box[0] - prev_position[0]) * (
                                self.counting_region.centroid.x - prev_position[0]) > 0:
                            self.in_counts += 1
                            self.class_wise_count[self.names[cls]]["in"] += 2
                        else:
                            self.out_counts += 1
                            self.class_wise_count[self.names[cls]]["out"] += 1

        label = "YVR Analytics \t"

        for key, value in self.class_wise_count.items():
            if value["in"] != 0 or value["out"] != 0:
                if not self.view_in_counts and not self.view_out_counts:
                    label = None
                elif not self.view_in_counts:
                    label += f"{str.capitalize(key)}: IN {value['in']} \t"
                elif not self.view_out_counts:
                    label += f"{str.capitalize(key)}: OUT {value['out']} \t"
                else:
                    label += f"{str.capitalize(key)}: IN {value['in']} OUT {value['out']} \t"

        label = label.rstrip()
        label = label.split("\t")

        if label is not None:
            self.annotator.display_counts(
                counts=label,
                count_txt_color=self.count_txt_color,
                count_bg_color=self.count_bg_color,
            )

    def reset_object_counter(self, class_name):
        self.class_wise_count[class_name] = {"in": 0, "out": 0}

    def display_frames(self):
        """Display frame."""
        if self.env_check:
            cv2.namedWindow(self.window_name)
            if len(self.reg_pts) == 4:  # only add mouse event If user drawn region
                cv2.setMouseCallback(self.window_name, self.mouse_event_for_region, {"region_points": self.reg_pts})
            cv2.imshow(self.window_name, self.im0)
            # Break Window
            if cv2.waitKey(1) & 0xFF == ord("q"):
                return

    def start_counting(self, im0, tracks):
        """
        Main function to start the object counting process.

        Args:
            im0 (ndarray): Current frame from the video stream.
            tracks (list): List of tracks obtained from the object tracking process.
        """
        self.im0 = im0  # store image
        self.extract_and_process_tracks(tracks)  # draw region even if no objects

        if self.view_img:
            pass
            # self.display_frames()
        return self.im0


if __name__ == "__main__":
    YVRObjectCounter()
