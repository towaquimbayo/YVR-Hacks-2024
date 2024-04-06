import { Helmet } from "react-helmet";
import SideNav from "./SideNav";

export default function Layout({ title, isLandingPage = false, children }) {
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
      <div className="flex h-screen bg-gray-200 p-3">
        <SideNav />
        <div className="bg-gray-100 w-full rounded-3xl p-3">
          {children}
        </div>
      </div>
    </>
  );
}