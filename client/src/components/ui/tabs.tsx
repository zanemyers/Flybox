/**
 * Represents a single tab in the Tabs component.
 */
interface Tabs {
  id: string; // Unique identifier for the tab
  label: string; // Text label displayed on the tab
}

/**
 * Props for the Tabs component
 */
interface Props {
  tabs: Tabs[]; // Array of tabs to render
  activeTab: string; // ID of the currently active tab
  onChange: (tabId: string) => void; // Callback when a tab is clicked
  className?: string; // Optional additional CSS classes
}

/**
 * Tabs component
 *
 * Renders a horizontal list of tabs using Bootstrap nav-tabs.
 * Highlights the active tab and triggers onChange when a tab is clicked.
 */
export default function Tabs(props: Props) {
  return (
    <ul className={`nav nav-tabs mb-3 ${props.className || ""}`} role="tablist">
      {props.tabs.map((tab) => (
        <li className="nav-item" key={tab.id}>
          <button
            type="button"
            className={`nav-link ${props.activeTab === tab.id ? "active" : ""}`} // Highlight active tab
            onClick={() => props.onChange(tab.id)} // Trigger callback with tab id
          >
            {tab.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
