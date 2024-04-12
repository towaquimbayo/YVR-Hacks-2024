import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import Layout from "../components/Layout";

export default function LiveMonitor() {
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);

  return (
    <Layout
      title="Live Monitor"
      heading={<h1 className="text-3xl font-semibold">Live Monitor</h1>}
    >
      <p className="text-lg">
        View the live video feed from the security camera.
      </p>
      <div className="mt-4 max-w-[800px]">
        <ReactPlayer
          url={{
            src: process.env.REACT_APP_SERVER_ENDPOINT + "/video",
            type: "multipart/x-mixed-replace",
          }}
          muted
          playing
          controls
          width="100%"
          height="100%"
          onError={(e) => console.log("Error:", e)}
          fallback={<p>Your browser does not support the video tag.</p>}
        />
      </div>
    </Layout>
  );
}
