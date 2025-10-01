import { NavLink } from "react-router-dom";
import tackleBox from "../../assets/images/tackle_box.png";
import NavigationBar from "./navbar";

/**
 * Header component
 *
 * Renders the top section of the site including the logo, title, and navigation bar.
 * Uses Bootstrap for layout and styling.
 */
export default function Header() {
  return (
    <header className="container-fluid py-3 text-center">
      {/* Logo and site title wrapped in a link to the home page */}
      <NavLink to="/" style={{ textDecoration: "none", color: "inherit" }}>
        <div className="d-flex justify-content-center align-items-center mb-3">
          {/* Logo image */}
          <img
            src={tackleBox}
            alt="Tackle Box"
            style={{ height: "4em" }}
            className="me-2"
          />
          {/* Site title */}
          <h1 className="m-0 display-4">Flybox</h1>
        </div>
      </NavLink>

      {/* Navigation bar component */}
      <NavigationBar />
    </header>
  );
}
