import { Link, NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  LayoutGrid,
  ClipboardList,
  Monitor,
  LogOut,
  X as CloseIcon,
} from "lucide-react";
import { clearSession } from "../redux/actions/UserAction";

export default function MobileNav({ menuActive, setMenuActive }) {
  const dispatch = useDispatch();
  return (
    <div
      className={`md:hidden fixed top-0 start-0 w-[90%] h-full bg-white shadow-xl z-50 transition-transform duration-1000 ease-in-out ${
        menuActive ? "-translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col py-16 px-12">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-3xl font-bold">Crow's Nest</h1>
          <button onClick={() => setMenuActive(!menuActive)}>
            <CloseIcon size={32} className="text-black hover:text-primary" />
          </button>
        </div>
        <ul className="flex flex-col gap-2 pt-12">
          <li className="rounded-lg py-4 px-2">
            <NavLink to="/" className="text-md flex items-center gap-3">
              <LayoutGrid size={18} /> Dashboard
            </NavLink>
          </li>
          <li className="rounded-lg py-4 px-2">
            <NavLink to="/reports" className="text-md flex items-center gap-3">
              <ClipboardList size={18} /> Reports
            </NavLink>
          </li>
          <li className="rounded-lg py-4 px-2">
            <NavLink
              to="/live-monitor"
              className="text-md flex items-center gap-3"
            >
              <Monitor size={18} /> Live Monitor
            </NavLink>
          </li>
          <li className="rounded-lg py-4 px-2">
            <Link
              onClick={async () => dispatch(clearSession())}
              to="/login"
              className="text-md flex items-center gap-3"
            >
              <LogOut size={18} /> Logout
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
