import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Calendar, Map, MoveLeft } from "lucide-react";
import Layout from "../components/Layout";
import mockReports from "../content/mockReports.json";
import { getDateTime } from "../utils/Helpers";
import Button from "../components/Button";

export default function Report() {
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [fetching, setFetching] = useState(true);
  const [report, setReport] = useState({});

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);

  // mock fetch reports
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    const fetchedReport = mockReports.find(
      (report) => report.id === Number(id)
    );
    setReport(fetchedReport);
    setTimeout(() => {
      setFetching(false);
    }, 1000);
  }, []);

  function handleReportStatus() {
    setReport((prevReport) => ({
      ...prevReport,
      resolved: !prevReport.resolved,
    }));
  }

  function ReportPriority({ priority }) {
    const getColor = (priority) => {
      switch (priority) {
        case "Low":
          return "#3dce79";
        case "Medium":
          return "#f69952";
        case "High":
          return "#ee4c4c";
        default:
          return "#3dce79";
      }
    };
    const priorityColor = getColor(priority);
    return (
      <div
        className={`flex items-center min-w-20 text-center justify-center bg-[${priorityColor}] text-white px-2 py-1.5 rounded-xl text-sm font-normal h-fit`}
      >
        {priority}
      </div>
    );
  }

  if (!report) {
    return (
      <Layout title="Report">
        <h1 className="text-3xl font-semibold">Report not found.</h1>
      </Layout>
    );
  }
  return (
    <Layout title="Report">
      <div
        className="flex gap-2 items-center cursor-pointer mb-2"
        onClick={() => navigate(-1)}
        title="Return back"
      >
        <MoveLeft size={16} />
        <span className="text-black">Return Back</span>
      </div>

      {fetching ? (
        <h1 className="text-3xl font-semibold animate-pulse">
          Fetching report...
        </h1>
      ) : (
        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-4 mb-8 w-full">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <span className="text-md text-primary">{report.category}</span>
                <ReportPriority priority={report.priority} />
              </div>
              <h1 className="text-3xl font-semibold">{report.title}</h1>
            </div>
            <Button
              title={
                report.resolved ? "Mark as Unresolved" : "Mark as Resolved"
              }
              onClick={handleReportStatus}
              text={report.resolved ? "Resolved" : "Unresolved"}
              outline
            />
          </div>
          <div className="flex gap-2 items-center mb-4">
            <div className="flex gap-2 items-center">
              <Calendar size={18} />
              <p>Posted on {getDateTime(report.timestamp)}</p>
            </div>
            <div className="flex gap-2 items-center">
              <Map size={18} />
              <p>Reported at {report.location}</p>
            </div>
          </div>
          <div className="flex flex-col mt-8">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-md font-normal text-gray-700">
              {report.description}
            </p>
          </div>
          <div className="flex flex-col mt-8">
            <h2 className="text-xl font-semibold mb-4">Video Playback</h2>
            <video
              controls
              width="100%"
              height="100%"
              className="mx-auto max-w-4xl"
            >
              <source src={report.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </Layout>
  );
}
