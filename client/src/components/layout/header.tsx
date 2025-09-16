import Navbar from "./navbar";
import tackleBox from "../../assets/images/tackle_box.png";
import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="container-fluid py-3 text-center">
      <NavLink to="/" style={{ textDecoration: "none", color: "inherit" }}>
        <div className="d-flex justify-content-center align-items-center mb-3">
          <img
            src={tackleBox}
            alt="Tackle Box"
            style={{ height: "4em" }}
            className="me-2"
          />
          <h1 className="m-0 display-4">Flybox</h1>
        </div>
      </NavLink>
      <Navbar />
    </header>
  );
}
