interface Tabs {
  id: string;
  label: string;
}

interface Props {
  tabs: Tabs[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string; // allow extra styling
}

export default function Tabs(props: Props) {
  return (
    <ul className={`nav nav-tabs mb-3 ${props.className || ""}`} role="tablist">
      {props.tabs.map((tab) => (
        <li className="nav-item" key={tab.id}>
          <button
            type="button"
            className={`nav-link ${props.activeTab === tab.id ? "active" : ""}`}
            onClick={() => props.onChange(tab.id)}
          >
            {tab.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
