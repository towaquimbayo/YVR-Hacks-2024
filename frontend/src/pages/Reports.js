import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function Reports() {
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  // useEffect(() => {
  //   if (!isLoggedIn) navigate("/login");
  // }, [isLoggedIn, navigate]);

  return (
    <Layout title="Reports">
      <h1>Reports</h1>
    </Layout>
  );
}
