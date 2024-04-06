import { Link, NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearSession } from "../redux/actions/UserAction";
import { LayoutGrid, ClipboardList, Monitor, LogOut } from 'lucide-react';

export default function SideNav() {
  const dispatch = useDispatch();

  return (
    <div className="w-[220px] pr-3 py-3 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold pl-3">Crow's Nest</h1>
        <ul className="flex flex-col gap-6 pt-16">
          <li className="rounded-lg p-2">
            <NavLink
              to="/"
              className="text-md flex items-center gap-3"
            >
              <LayoutGrid size={18} /> Dashboard
            </NavLink>
          </li>
          <li className="rounded-lg p-2">
            <NavLink
              to="/reports"
              className="text-md flex items-center gap-3"
            >
              <ClipboardList size={18} /> Reports
            </NavLink>
          </li>
          <li className="rounded-lg p-2">
            <NavLink
              to="/live-monitor"
              className="text-md flex items-center gap-3"
            >
              <Monitor size={18} /> Live Monitor
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="pl-3">
        <Link
          onClick={async () => dispatch(clearSession())}
          to="/login"
          className="text-md flex items-center gap-3"
        >
          <LogOut size={18} /> Logout
        </Link>
      </div>
    </div>
  );
}