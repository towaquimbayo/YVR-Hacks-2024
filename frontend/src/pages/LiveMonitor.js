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

  return (
    <Layout
      title="Live Monitor"
      heading={<h1 className="text-3xl font-semibold">Live Monitor</h1>}
    >
      <p className="text-lg">
        View the live video footage from the security camera.
      </p>
      <div className="mt-4 relative max-w-full max-h-full aspect-w-16 aspect-h-9">
        <iframe
          id="live-monitor"
          src={process.env.REACT_APP_SERVER_ENDPOINT + "/video"}
          title="Live Monitor"
          className="relative w-full h-[740px] aspect-w-[16] aspect-h-[9]"
          allow="autoplay; fullscreen"
        ></iframe>
      </div>
    </Layout>
  );
}
