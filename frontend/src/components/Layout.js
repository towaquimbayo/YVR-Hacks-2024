import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import SideNav from "./SideNav";

export default function Layout({ title, isLandingPage = false, children }) {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

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
        <div
          className={`bg-gray-100 w-full ${isLoggedIn ? "rounded-3xl p-12" : ""}`}
        >
          {children}
        </div>
      </div>
    </>
  );
}
