import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import LiveMonitor from "./pages/LiveMonitor";
import Report from "./pages/Report";
import Reports from "./pages/Reports";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="login" element={<Login />} />
      <Route path="live-monitor" element={<LiveMonitor />} />
      <Route path="report" element={<Report />} />
      <Route path="reports" element={<Reports />} />
    </Routes>
  );
}
