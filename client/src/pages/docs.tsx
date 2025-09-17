import { FishTalesDoc, ShopReelDoc, SiteScoutDoc } from "../components/docs";
import SideBar from "../components/ui/sideBar";
import React, { useState } from "react";

interface DocProps {
  setActiveTab: (tab: string) => void;
}

const sideBarItems = ["ShopReel", "FishTales", "SiteScout"];
const docComponents: { [key: string]: React.FC<DocProps> } = {
  ShopReel: ShopReelDoc,
  FishTales: FishTalesDoc,
  SiteScout: SiteScoutDoc,
};

export default function Docs() {
  // 1. Read initial tab from query param
  const queryTab =
    new URLSearchParams(window.location.search).get("tab") || "ShopReel";

  // 2. Set the active tab (default to "ShopReel")
  const [activeTab, setActiveTab] = useState(
    sideBarItems.includes(queryTab) ? queryTab : "ShopReel",
  );
  const ActiveComponent = docComponents[activeTab];

  return (
    <div className="docs d-flex">
      <SideBar
        items={sideBarItems}
        activeKey={activeTab}
        onSelect={setActiveTab}
      />

      {/*Content Cards */}
      <div className="docs-content card shadow-sm p-4 bg-light flex-grow-1">
        <ActiveComponent setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
