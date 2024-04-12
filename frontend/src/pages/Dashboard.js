import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
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
    { name: 'Sun', count: 12 },
    { name: 'Mon', count: 40 },
    { name: 'Tue', count: 30 },
    { name: 'Wed', count: 20 },
    { name: 'Thu', count: 55 },
    { name: 'Fri', count: 9 },
    { name: 'Sat', count: 23 },
  ];

  const tableData = [
    { country: 'Australia', domain: 'http://example.com', storage: '4TB', server: 'Active', page: '2.8min', report: 'View' },
    { country: 'Malaysia', domain: 'http://example.com', storage: '1TB', server: 'Active', page: '2.5min', report: 'View' },
    { country: 'Portugal', domain: 'http://example.com', storage: '768GB', server: 'Trouble', page: '4.1min', report: 'View' },
    { country: 'Indonesia', domain: 'http://example.com', storage: '1.4TB', server: 'Active', page: '5.5min', report: 'View' },
    { country: 'Japan', domain: 'http://example.com', storage: '1TB', server: 'Active', page: '4.1min', report: 'View' },
    { country: 'Singapore', domain: 'http://example.com', storage: '4TB', server: 'Active', page: '7.0min', report: 'View' },
  ];

  const barChartData = [
    { name: 'Sun', most: 40, least: 20 },
    { name: 'Mon', most: 35, least: 15 },
    { name: 'Tue', most: 30, least: 22 },
    { name: 'Wed', most: 28, least: 18 },
    { name: 'Thu', most: 32, least: 25 },
    { name: 'Fri', most: 38, least: 30 },
    { name: 'Sat', most: 45, least: 35 },
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
          <h2 className="text-md font-semibold mb-4">Weekly Reports</h2>
          <ResponsiveContainer>
            <LineChart
              data={lineChartData}
              margin={{ left: -35, bottom: 35 }}
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
              <Line type="monotone" dataKey="count" stroke="#508cdb" activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <div className="bg-white p-4 rounded-xl flex items-center">
            <div className="bg-gray-100 rounded-lg p-3 mr-4">
              <Users size={26} color="#666" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Current People</p>
              <p className="text-4xl font-semibold">188</p>
            </div>
          </div>
        </div>

        <div className="bg-white col-span-3 rounded-xl p-4 px-6 ">
          <h2 className="text-md font-semibold mb-4">Latest Reports</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th>Country</th>
                <th>Domain Name</th>
                <th>Storage</th>
                <th>Server Status</th>
                <th>Page Load</th>
                <th>Document Report</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td>{row.country}</td>
                  <td>{row.domain}</td>
                  <td>{row.storage}</td>
                  <td>{row.server}</td>
                  <td>{row.page}</td>
                  <td>{row.report}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* <div>
          <h2 className="text-xl font-semibold mb-4">Server Status Overview</h2>
          <BarChart width={500} height={300} data={barChartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Bar dataKey="most" fill="#8884d8" />
            <Bar dataKey="least" fill="#82ca9d" />
          </BarChart>
        </div> */}
      </div>
    </Layout>
  );
}
