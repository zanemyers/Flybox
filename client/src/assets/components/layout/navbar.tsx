import { NavLink } from "react-router-dom";

interface NavItem {
  label: string;
  href: string;
  dropdown?: NavItem[];
}

const links: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "ShopReel", href: "/shopReel" },
  { label: "FishTales", href: "/fishTales" },
  {
    label: "More",
    href: "#",
    dropdown: [
      { label: "SiteScout", href: "/siteScout" },
      { label: "Docs", href: "/docs" },
    ],
  },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-light rounded shadow-sm px-3">
      <ul className="navbar-nav mx-auto">
        {links.map((link) =>
          !link.dropdown ? (
            <li className="nav-item" key={link.label}>
              <NavLink
                to={link.href}
                className={({ isActive }: { isActive: boolean }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ) : (
            <li className="nav-item dropdown" key={link.label}>
              <a
                className="nav-link dropdown-toggle"
                href={link.href}
                id={`${link.label}-dropdown`}
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {link.label}
              </a>
              <ul
                className="dropdown-menu"
                aria-labelledby={`${link.label}-dropdown`}
              >
                {link.dropdown.map((sub) => (
                  <li key={sub.label}>
                    <NavLink
                      to={sub.href}
                      className={({ isActive }: { isActive: boolean }) =>
                        `dropdown-item${isActive ? " active" : ""}`
                      }
                    >
                      {sub.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}
