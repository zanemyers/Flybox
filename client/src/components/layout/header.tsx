import { NavLink } from "react-router-dom";
import tackleBox from "../../assets/images/tackle_box.png";
import NavigationBar from "./navbar";

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
      <NavigationBar />
    </header>
  );
}
