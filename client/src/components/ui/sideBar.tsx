import { Nav } from "react-bootstrap";

/**
 * Props for SideBar component
 */
interface Props {
  items: string[]; // Array of item names to display in the sidebar
  activeKey: string; // Currently selected item
  onSelect: (item: string) => void; // Callback when an item is selected
}

/**
 * SideBar component
 *
 * Displays a vertical navigation sidebar using Bootstrap pills.
 * Allows selection of items and highlights the active item.
 */
export default function SideBar(props: Props) {
  /**
   * Handle selection of a nav item
   * React-Bootstrap passes `eventKey` as string | null, so we guard against null
   */
  const handleSelect = (eventKey: string | null) => {
    if (eventKey) props.onSelect(eventKey); // Only call onSelect if eventKey is non-null
  };

  return (
    <div className="docs-sidebar">
      <Nav
        variant="pills" // Use pill-style navigation
        className="flex-column" // Stack vertically
        activeKey={props.activeKey} // Highlight the active item
        onSelect={handleSelect} // Pass the type-safe wrapper
      >
        {/* Render each item as a Nav.Item with a Nav.Link */}
        {props.items.map((item) => (
          <Nav.Item key={item}>
            <Nav.Link eventKey={item}>{item}</Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
}
