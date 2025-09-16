// Layout.tsx
import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";

export const Layout = () => {
  return (
    <div className="app-layout d-flex flex-column min-vh-100">
      <Header />
      <main className="container flex-grow-1 py-4">
        <Outlet /> {/* Pages will be injected here */}
      </main>
      <Footer />
    </div>
  );
};
