import Navbar from "./navbar";
import tackleBox from "../images/tackle_box.png";

export function Header() {
  return (
    <header className="container-fluid py-3 text-center">
      <div className="d-flex justify-content-center align-items-center mb-3">
        <img
          src={tackleBox}
          alt="Tackle Box"
          style={{ height: "4em" }}
          className="me-2"
        />
        <h1 className="m-0 display-4">Flybox</h1>
      </div>

      <Navbar />
    </header>
  );
}
