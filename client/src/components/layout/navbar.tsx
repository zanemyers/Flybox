import { NavLink } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";

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
    href: "",
    dropdown: [
      { label: "SiteScout", href: "/siteScout" },
      { label: "Docs", href: "/docs" },
    ],
  },
  { label: "About", href: "/about" },
];

export default function NavigationBar() {
  return (
    <Navbar
      expand="sm"
      bg="light"
      variant="light"
      className="rounded shadow-sm px-3"
    >
      <Container>
        <Nav className="mx-auto">
          {links.map((link) =>
            !link.dropdown ? (
              <Nav.Link as={NavLink} to={link.href} key={link.label}>
                {link.label}
              </Nav.Link>
            ) : (
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
