import { NavLink } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";

/**
 * Interface for defining navigation items.
 * Supports optional dropdown menus.
 */
interface NavItem {
  label: string; // Display text
  href: string; // Navigation URL
  dropdown?: NavItem[]; // Optional array for dropdown items
}

/** Navigation links for the site, including dropdowns */
const links: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "ShopReel", href: "/shopReel" },
  { label: "FishTales", href: "/fishTales" },
  {
    label: "More",
    href: "",
    dropdown: [
      { label: "SiteScout", href: "/siteScout" },
      { label: "Docs", href: "/docs" },
    ],
  },
  { label: "About", href: "/about" },
];

/**
 * NavigationBar component
 *
 * Renders the site's main navigation using React-Bootstrap Navbar.
 * - Supports responsive collapse
 * - Handles top-level links and dropdown menus
 * - Uses React Router NavLink for client-side routing
 */
export default function NavigationBar() {
  return (
    <Navbar
      expand="sm" // Navbar collapses below "sm" screen size
      bg="light"
      variant="light"
      className="rounded shadow-sm px-3"
    >
      <Container>
        {/* Navigation links centered */}
        <Nav className="mx-auto">
          {links.map((link) =>
            !link.dropdown ? (
              // Regular nav link
              <Nav.Link as={NavLink} to={link.href} key={link.label}>
                {link.label}
              </Nav.Link>
            ) : (
              // Dropdown menu
              <NavDropdown
                title={link.label}
                id={`${link.label}-dropdown`}
                key={link.label}
              >
                {link.dropdown.map((sub) => (
                  <NavDropdown.Item as={NavLink} to={sub.href} key={sub.label}>
                    {sub.label}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            ),
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}
