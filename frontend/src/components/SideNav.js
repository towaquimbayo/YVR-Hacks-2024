import { Home, BarChart2, Monitor, LogOut } from 'lucide-react';

export default function SideNav() {
  return (
    <div className="w-[220px] p-3 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold">Crow's Nest</h1>
        <ul className="flex flex-col gap-6 pt-16">
          <li>
            <a href="/" className="text-lg flex items-center gap-2">
              <Home size={18} /> Dashboard
            </a>
          </li>
          <li>
            <a href="/reports" className="text-lg flex items-center gap-2">
              <BarChart2 size={18} /> Reports
            </a>
          </li>
          <li>
            <a href="/live-monitor" className="text-lg flex items-center gap-2">
              <Monitor size={18} /> Live Monitor
            </a>
          </li>
        </ul>
      </div>

      <a href="/login" className="text-lg flex items-center gap-2">
        <LogOut size={18} /> Logout
      </a>
    </div>
  );
}