import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import LiveMonitor from "./pages/LiveMonitor";
import Report from "./pages/Report";
import Reports from "./pages/Reports";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="live-monitor" element={<LiveMonitor />} />
      <Route path="report" element={<Report />} />
      <Route path="reports" element={<Reports />} />
    </Routes>
  );
}
