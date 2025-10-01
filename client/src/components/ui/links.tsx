import React, { type ReactNode } from "react";

/**
 * Props for HashLink and ExternalLink
 */
interface LinkProps {
  target: string; // The URL or element ID to navigate to
  children: ReactNode; // Content inside the link
  tab?: string; // Optional tab ID to activate before scrolling
  onActivateTab?: (tab: string) => void; // Callback to activate a tab before scrolling
}

/**
 * HashLink Component
 * Handles internal page links using an element ID (e.g., "#section-id").
 * Optionally activates a tab before scrolling to the target element.
 */
function HashLink(props: LinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default anchor navigation

    if (props.tab && props.onActivateTab) {
      // If a tab is specified, activate it first
      props.onActivateTab(props.tab);

      // Delay scroll to wait for the tab/component to render
      setTimeout(() => {
        const el = document.getElementById(props.target);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      // Otherwise, just scroll to the target element
      const el = document.getElementById(props.target);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <a href={`#${props.target}`} onClick={handleClick}>
      {props.children}
    </a>
  );
}

/**
 * ExternalLink Component
 * Handles normal external links opening in a new tab with proper security attributes.
 */
function ExternalLink(props: LinkProps) {
  return (
    <a href={props.target} target="_blank" rel="noopener noreferrer">
      {props.children}
    </a>
  );
}

/**
 * Props for the main Link component
 */
interface Props extends LinkProps {
  variant: "external" | "hash"; // Determines which type of link to render
}

/**
 * Main Link Component
 * Renders either a HashLink or ExternalLink based on the "variant" prop.
 */
export default function Link({ variant, ...linkProps }: Props) {
  if (variant === "hash") return <HashLink {...linkProps} />;
  else return <ExternalLink {...linkProps} />;
}
