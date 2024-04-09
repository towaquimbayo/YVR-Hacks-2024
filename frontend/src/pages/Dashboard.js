import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function Dashboard() {
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);

  return (
    <Layout
      title="Dashboard"
      isLandingPage
      heading={<h1 className="text-3xl font-semibold">Dashboard</h1>}
    >
      <p className="text-lg">
        Welcome to Crow's Nest! This is a dashboard page.
      </p>
    </Layout>
  );
}
