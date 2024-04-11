import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function LiveMonitor() {
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    async function fetchReports() {
      const response = await fetch(
        process.env.REACT_APP_SERVER_ENDPOINT + "/video"
      );
      // const data = await response.json();
      console.log("Fetched Live Video Response:", response);
    }
    fetchReports();
  }, []);

  return (
    <Layout
      title="Live Monitor"
      heading={<h1 className="text-3xl font-semibold">Live Monitor</h1>}
    >
      <p className="text-lg">
        Welcome to Crow's Nest! This is a live monitor page.
      </p>
    </Layout>
  );
}
