import { Outlet } from "react-router-dom";
import Header from "@components/layout/header";
import Footer from "@components/layout/footer";

/**
 * Layout component
 *
 * Wraps all pages with a consistent layout including a header, footer, and main content area.
 * Uses React Router's Outlet to render nested routes dynamically.
 */
export const Layout = () => {
  return (
    <div className="app-layout d-flex flex-column min-vh-100">
      {/* Site header */}
      <Header />

      {/* Main content area */}
      <main className="container flex-grow-1 py-4">
        {/* Outlet renders the currently matched child route */}
        <Outlet />
      </main>

      {/* Site footer */}
      <Footer />
    </div>
  );
};
