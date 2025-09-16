import { Nav } from "react-bootstrap";

interface Props {
  items: string[];
  activeKey: string;
  onSelect: (item: string) => void;
}

export default function SideBar(props: Props) {
  const handleSelect = (eventKey: string | null) => {
    if (eventKey) props.onSelect(eventKey); // guard against null
  };

  return (
    <div className="docs-sidebar">
      <Nav
        variant="pills"
        className="flex-column"
        activeKey={props.activeKey}
        onSelect={handleSelect} // pass the type-safe wrapper
      >
        {props.items.map((item) => (
          <Nav.Item key={item}>
            <Nav.Link eventKey={item}>{item}</Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
}
