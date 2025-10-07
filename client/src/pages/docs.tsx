import React, { useState } from "react";

import FishTalesDoc from "@components/docs/fishTalesDoc";
import ShopReelDoc from "@components/docs/shopReelDoc";
import SiteScoutDoc from "@components/docs/siteScoutDoc";
import SideBar from "@components/ui/sideBar";

interface DocProps {
  setActiveTab: (tab: string) => void;
}

// Sidebar items (available documentation tabs)
const sideBarItems = ["ShopReel", "FishTales", "SiteScout"];

// Mapping of tab names to their corresponding component
const docComponents: { [key: string]: React.FC<DocProps> } = {
  ShopReel: ShopReelDoc,
  FishTales: FishTalesDoc,
  SiteScout: SiteScoutDoc,
};

/**
 * Docs Page Component
 *
 * Renders a sidebar with selectable documentation tabs and displays
 * the corresponding content component for the active tab.
 * Reads the initial tab from the URL query parameter if available.
 */
export default function Docs() {
  // Read initial tab from query parameter (?tab=ShopReel)
  const queryTab = new URLSearchParams(window.location.search).get("tab") || "ShopReel";

  // Manage the currently active tab in state
  const [activeTab, setActiveTab] = useState(
    sideBarItems.includes(queryTab) ? queryTab : "ShopReel"
  );

  // Get the component corresponding to the active tab
  const ActiveComponent = docComponents[activeTab];

  return (
    <div className="docs d-flex">
      {/* Sidebar for tab navigation */}
      <SideBar items={sideBarItems} activeKey={activeTab} onSelect={setActiveTab} />

      {/* Main content area: renders the active documentation component */}
      <div className="docs-content card shadow-sm p-4 bg-light flex-grow-1">
        <ActiveComponent setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
