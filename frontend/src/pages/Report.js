import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Calendar, Map, MoveLeft } from "lucide-react";
import Layout from "../components/Layout";
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

  useEffect(() => {
    async function fetchReport() {
      try {
        const response = await fetch(
          process.env.REACT_APP_SERVER_ENDPOINT + "/get_incidents"
        );
        if (!response.ok) throw new Error("Failed to fetch reports");
        const data = await response.json();
        console.log("Fetched Reports: ", data);

        if (!data || !data.length || data.length === 0) {
          setReport({});
          return;
        }

        // find the incident with the id
        const priority = ["Low", "Medium", "High"];
        const id = new URLSearchParams(window.location.search).get("id");
        const fetchedReport = data.find((report) => report.id === Number(id));
        if (!fetchedReport) {
          setReport({});
          return;
        }

        setReport({
          id: fetchedReport.id,
          title: fetchedReport.object + " at " + fetchedReport.location,
          category: fetchedReport.category || "Unknown category",
          location: fetchedReport.location,
          image: "data:image/jpeg;charset=utf-8;base64," + fetchedReport.image,
          priority: priority[fetchedReport.priority],
          timestamp: fetchedReport.time_unattended,
          resolved: fetchedReport.is_resolved,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setFetching(false);
      }
    }
    fetchReport();
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
    <Layout
      title="Report"
      heading={
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
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
              <h1 className="text-3xl font-semibold">{report.title}</h1>
            )}
          </div>
        </div>
      }
    >
      {!fetching &&
        (report && Object.keys(report).length > 0 ? (
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-4 mb-8 w-full">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <span className="text-md text-primary font-medium">
                    {report.category}
                  </span>
                  <ReportPriority priority={report.priority} />
                </div>
              </div>
              <Button
                title={
                  report.resolved ? "Mark as Unresolved" : "Mark as Resolved"
                }
                onClick={handleReportStatus}
                text={
                  report.resolved ? "Mark as Unresolved" : "Mark as Resolved"
                }
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
              <h2 className="text-xl font-semibold mb-4">Image Playback</h2>
              <img
                src={report.image}
                alt="Report"
                className="mx-auto max-w-4xl"
              />
            </div>
          </div>
        ) : (
          <h1 className="text-3xl font-semibold">Report not found.</h1>
        ))}
    </Layout>
  );
}
