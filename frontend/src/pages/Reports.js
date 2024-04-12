import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { Circle, CircleCheck } from "lucide-react";
import Layout from "../components/Layout";
import mockReports from "../content/mockReports.json";
import { getDateTime } from "../utils/Helpers";

export default function Reports() {
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);
  const tabs = ["All", "Resolved", "Unresolved"];
  const [reports, setReports] = useState();
  const [selectedTab, setSelectedTab] = useState("Resolved");
  const filteredReports = useMemo(() => {
    if (!reports || !reports.length || !reports.length === 0) return [];
    return reports.filter(({ resolved }) => {
      if (selectedTab === "All") return true;
      if (selectedTab === "Unresolved") return !resolved;
      if (selectedTab === "Resolved") return resolved;
      return false;
    });
  }, [reports, selectedTab]);

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await fetch(
          process.env.REACT_APP_SERVER_ENDPOINT + "/get_incidents"
        );
        if (!response.ok) throw new Error("Failed to fetch reports");
        const data = await response.json();
        console.log("Fetched Reports: ", data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchReports();
    setReports(mockReports);
  }, []);

  function ReportPriority({ priority }) {
    const getColor = (priority) => {
      switch (priority) {
        case "Low":
          return "bg-[#3dce79]";
        case "Medium":
          return "bg-[#f69952]";
        case "High":
          return "bg-[#ee4c4c]";
        default:
          return "bg-[#3dce79]";
      }
    };
    const priorityColor = getColor(priority);
    return (
      <div
        className={`flex items-center min-w-20 text-center justify-center ${priorityColor} text-white px-2 py-1.5 rounded-xl text-sm font-normal h-fit`}
      >
        {priority}
      </div>
    );
  }

  function ReportCard({ report }) {
    return (
      <div
        className="rounded-lg p-4 bg-white flex gap-4 items-center cursor-pointer"
        title="View Report"
        onClick={() => navigate(`/report?id=${report.id}`)}
      >
        <div className="w-fit p-1 cursor-pointer">
          {report.resolved ? (
            <CircleCheck size={24} className="text-[#63d873]" />
          ) : (
            <Circle size={24} className="text-gray-700" />
          )}
        </div>
        <div className="flex flex-col w-full">
          <div className="flex justify-between gap-4 mb-2 items-center">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-primary font-medium">
                {report.category}
              </span>
              <h2 className="text-lg text-black font-semibold">
                {report.title}
              </h2>
            </div>
            <ReportPriority priority={report.priority} />
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-sm text-gray-700 font-normal">
              {getDateTime(report.timestamp)}
            </p>
            {" | "}
            <p className="text-sm text-gray-700 font-normal">
              {report.location}
            </p>
          </div>
          <p className="text-sm text-gray-700 font-normal">
            {report.description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Layout
      title="Reports"
      heading={
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-semibold">Reports</h1>
          <div className="bg-primary text-white px-5 py-0.5 rounded-xl text-lg font-medium">
            {filteredReports.length}
          </div>
        </div>
      }
    >
      <Tabs value={selectedTab}>
        <TabsHeader
          className="w-fit bg-transparent gap-2"
          indicatorProps={{ className: "bg-primary bg-opacity-10 rounded-xl" }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              value={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 ${
                selectedTab === tab
                  ? "text-primary font-medium"
                  : "text-black font-normal"
              }`}
            >
              {tab}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody
          animate={{
            initial: { y: 250 },
            mount: { y: 0 },
            unmount: { y: 250 },
          }}
        >
          {filteredReports.length === 0 ? (
            <TabPanel value={selectedTab}>
              <h2 className="text-lg text-black font-semibold">
                No reports found
              </h2>
            </TabPanel>
          ) : (
            filteredReports.map((report) => (
              <TabPanel
                key={report.id}
                value={selectedTab}
                className="p-0 mt-4"
              >
                <ReportCard report={report} />
              </TabPanel>
            ))
          )}
          {/* <table className="w-full bg-white shadow-md p-0 mt-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left text-sm font-semibold">Resolved</th>
                <th className="py-2 px-4 text-left text-sm font-semibold">Title</th>
                <th className="py-2 px-4 text-left text-sm font-semibold">Category</th>
                <th className="py-2 px-4 text-left text-sm font-semibold">Priority</th>
                <th className="py-2 px-4 text-left text-sm font-semibold">Timestamp</th>
                <th className="py-2 px-4 text-left text-sm font-semibold">Location</th>
                <th className="py-2 px-4 text-left text-sm font-semibold">Video</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => {
                return (
                  <tr key={report.id} className="border-b border-gray-200">
                    <td className="py-2 px-4">
                      {report.resolved ? (
                        <CircleCheck size={24} className="text-[#63d873]" />
                      ) : (
                        <Circle size={24} className="text-gray-600" />
                      )}
                    </td>
                    <td className="py-2 px-4 text-sm text-ellipsis">
                      {report.title}
                    </td>
                    <td className="py-2 px-4 text-sm text-ellipsis">
                      {report.category}
                    </td>
                    <td className="py-2 px-4 text-sm text-ellipsis">
                      {report.priority}
                    </td>
                    <td className="py-2 px-4 text-sm text-ellipsis">
                      {getDateTime(report.timestamp)}
                    </td>
                    <td className="py-2 px-4 text-sm text-ellipsis">
                      {report.location}
                    </td>
                    <td className="py-2 px-4 text-sm text-ellipsis">
                      <Link
                        to={report.video}
                        className="text-primary hover:underline hover:text-secondary transition-all duration-800 ease-in-out"
                      >
                        {report.video}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table> */}
        </TabsBody>
      </Tabs>
    </Layout>
  );
}
