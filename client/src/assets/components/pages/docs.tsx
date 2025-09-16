import { FishTalesDoc, ShopReelDoc, SiteScoutDoc } from "../docs/index";
import SideBar from "../ui/sideBar";
import React, { useState, useEffect } from "react";

const sideBarItems = ["ShopReel", "FishTales", "SiteScout"];
const docComponents: { [key: string]: React.FC } = {
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

  // 3. Scroll to hash if present
  useEffect(() => {
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      setTimeout(() => {
        const targetEl = document.getElementById(hash);
        if (targetEl)
          targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [activeTab]); // run whenever activeTab changes

  return (
    <div className="docs d-flex">
      <SideBar
        items={sideBarItems}
        activeKey={activeTab}
        onSelect={setActiveTab}
      />

      {/*Content Cards */}
      <div className="docs-content card shadow-sm p-4 bg-light flex-grow-1">
        <ActiveComponent />
      </div>
    </div>
  );
}
