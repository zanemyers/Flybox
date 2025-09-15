// Layout.tsx
import { Outlet } from "react-router-dom";
import { Header } from "./header";
import { Footer } from "./footer";

export const Layout = () => {
  return (
    <div className="app-layout">
      <Header />
      <main className="container py-4">
        <Outlet /> {/* Pages will be injected here */}
      </main>
      <Footer />
    </div>
  );
};
