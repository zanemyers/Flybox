import React, { type ReactNode } from "react";

interface HashLinkProps {
  id: string;
  tab?: string; // optional tab to activate first
  children: ReactNode;
  onActivateTab?: (tab: string) => void;
}

export default function HashLink({
  id,
  tab,
  children,
  onActivateTab,
}: HashLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (tab && onActivateTab) {
      onActivateTab(tab);
      // delay scroll to wait for component mount
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <a href={`#${id}`} onClick={handleClick}>
      {children}
    </a>
  );
}
