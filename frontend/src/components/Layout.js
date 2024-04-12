import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Menu, Bell } from "lucide-react";
import SideNav from "./SideNav";
import MobileNav from "./MobileNav";

export default function Layout({
  title,
  isLandingPage = false,
  children,
  heading = null,
}) {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [menuActive, setMenuActive] = useState(false);

  if (title && typeof document !== "undefined") {
    document.title = isLandingPage ? "Crow's Nest" : `${title} | Crow's Nest`;
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>
          {isLandingPage ? "Crow's Nest" : `${title} | Crow's Nest`}
        </title>
      </Helmet>
      <div className="flex min-h-screen bg-gray-200 p-3">
        {isLoggedIn && <SideNav />}
        {isLoggedIn && (
          <MobileNav menuActive={menuActive} setMenuActive={setMenuActive} />
        )}
        <div
          className={`bg-gray-100 w-full ${isLoggedIn ? "rounded-3xl p-12" : ""
            }`}
        >
          {heading && (
            <div className="flex items-center mb-4 gap-4 justify-between">
              {heading}
              <div className="flex gap-4">
                <button
                  className="block bg-white p-2 rounded-lg"
                >
                  <Bell size={20} />
                </button>

                <button
                  className="block md:hidden bg-white p-2 rounded-lg"
                  onClick={() => setMenuActive(!menuActive)}
                >
                  <Menu size={20} />
                </button>
              </div>
            </div>
          )}
          {children}
        </div>
      </div>
    </>
  );
}
