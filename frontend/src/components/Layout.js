import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Menu } from "lucide-react";
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
          className={`bg-gray-100 w-full ${
            isLoggedIn ? "rounded-3xl p-12" : ""
          }`}
        >
          {heading && (
            <div className="flex items-center mb-4 gap-4 justify-between">
              {heading}
              <button
                className="block md:hidden"
                onClick={() => setMenuActive(!menuActive)}
              >
                <Menu size={32} />
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </>
  );
}
