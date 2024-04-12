import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Users, BadgeAlert, Timer } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer } from 'recharts';
import Layout from "../components/Layout";

export default function Dashboard() {
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [reports, setReports] = useState();
  const lineChartRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await fetch(
          process.env.REACT_APP_SERVER_ENDPOINT + "/get_incidents"
        );
        if (!response.ok) throw new Error("Failed to fetch reports");
        const data = await response.json();
        console.log("Fetched Reports: ", data);

        if (!data || !data.length || data.length === 0) {
          setReports([]);
          return;
        }

        const priority = ["Low", "Medium", "High"];
        let incidents = [];
        data.forEach((incident) => {
          incidents.push({
            id: incident.id,
            title: incident.object + " at " + incident.location,
            category: incident.category || "Unknown category",
            location: incident.location,
            image: incident.image,
            priority: priority[incident.priority],
            time_unattended: incident.time_unattended,
            is_resolved: incident.is_resolved,
          });
        });
        setReports(incidents);
      } catch (error) {
        console.error(error);
      }
    }
    fetchReports();
  }, []);

  const lineChartData = [
    { name: 'Sun', incidents: 12, people: 100 },
    { name: 'Mon', incidents: 40, people: 200 },
    { name: 'Tue', incidents: 30, people: 850 },
    { name: 'Wed', incidents: 20, people: 398 },
    { name: 'Thu', incidents: 55, people: 120 },
    { name: 'Fri', incidents: 90, people: 300 },
    { name: 'Sat', incidents: 23, people: 742 },
  ];

  console.log(reports)

  return (
    <Layout
      title="Dashboard"
      isLandingPage
      heading={<h1 className="text-3xl font-semibold">Dashboard</h1>}
    >
      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="bg-white col-span-2 rounded-xl p-4 px-6 w-full h-[300px] min-w-[400px]" ref={lineChartRef} >
          <h2 className="text-md font-semibold mb-4">Weekly Overview</h2>
          <ResponsiveContainer>
            <LineChart
              data={lineChartData}
              margin={{ left: -25, bottom: 35 }}
            >
              <XAxis
                dataKey="name"
                padding={{ left: 20, right: 20 }}
                tick={{ fontSize: 12 }}
                tickLine={false}
                stroke="rgba(0, 0, 0, 0.3)"
              />
              <YAxis tickLine={false} tick={{ fontSize: 12 }} stroke="rgba(0, 0, 0, 0.3)" />
              <CartesianGrid strokeOpacity={0.3} />
              <Tooltip />
              <Line type="monotone" dataKey="incidents" stroke="#508cdb" activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="people" stroke="#f69952" activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-2">
          <div className="bg-white p-4 rounded-xl flex items-center">
            <div className="bg-gray-100 rounded-lg p-3 mr-4">
              <BadgeAlert size={26} color="#666" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Unresolved Incidents</p>
              <p className="text-4xl font-semibold">{reports && reports.filter(report => !report.is_resolved).length}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl flex items-center">
            <div className="bg-gray-100 rounded-lg p-3 mr-4">
              <Users size={26} color="#666" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Current People</p>
              <p className="text-4xl font-semibold">188</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl flex items-center">
            <div className="bg-gray-100 rounded-lg p-3 mr-4">
              <Timer size={26} color="#666" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Avg. Response Time</p>
              <p className="text-4xl font-semibold">12m</p>
            </div>
          </div>

          {/* <div>
            <h2 className="text-xl font-semibold mb-4">Server Status Overview</h2>
            <BarChart width={300} height={300} data={barChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Bar dataKey="most" fill="#8884d8" />
              <Bar dataKey="least" fill="#82ca9d" />
            </BarChart>
          </div> */}
        </div>

        <div className="bg-white col-span-3 rounded-xl p-4 px-6 ">
          <h2 className="text-md font-semibold mb-4">Latest Incidents</h2>
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm">
                <th className="bg-gray-100 p-2 text-gray-500 rounded-s-lg">Title</th>
                <th className="bg-gray-100 p-2 text-gray-500">Category</th>
                <th className="bg-gray-100 p-2 text-gray-500">Location</th>
                <th className="bg-gray-100 p-2 text-gray-500">Priority</th>
                <th className="bg-gray-100 p-2 text-gray-500 hidden lg:block">Timestamp</th>
                <th className="bg-gray-100 p-2 text-gray-500 rounded-e-lg">Status</th>
              </tr>
            </thead>
            <tbody>
              {reports && reports
                .sort((a, b) => {
                  const priorityOrder = { High: 0, Medium: 1, Low: 2 };
                  if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                  }
                  return new Date(b.time_unattended) - new Date(a.time_unattended);
                })
                .slice(0, 10)
                .map((row, index) => {
                  let priorityColor;
                  if (row.priority === 'Low') {
                    priorityColor = 'bg-[#3dce79]';
                  } else if (row.priority === 'Medium') {
                    priorityColor = 'bg-[#f69952]';
                  } else if (row.priority === 'High') {
                    priorityColor = 'bg-[#ee4c4c]';
                  }

                  return (
                    <tr key={index}>
                      <td className="p-2">{row.title}</td>
                      <td className="p-2">{row.category}</td>
                      <td className="p-2">{row.location}</td>
                      <td className="p-2">
                        <span className={`rounded-lg py-1 px-4 text-white ${priorityColor}`}>
                          {row.priority}
                        </span>
                      </td>
                      <td className="p-2 hidden lg:block">{row.time_unattended}</td>
                      <td className="p-2">{row.is_resolved ? 'Resolved' : 'Unresolved'}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
