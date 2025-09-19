import React, { type ReactNode } from "react";

interface LinkProps {
  target: string;
  children: ReactNode;
  tab?: string; // optional tab to activate first
  onActivateTab?: (tab: string) => void;
}

function HashLink(props: LinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (props.tab && props.onActivateTab) {
      props.onActivateTab(props.tab);
      // delay scroll to wait for component mount
      setTimeout(() => {
        const el = document.getElementById(props.target);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
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

function ExternalLink(props: LinkProps) {
  return (
    <a href={props.target} target="_blank" rel="noopener noreferrer">
      {props.children}
    </a>
  );
}

interface Props extends LinkProps {
  variant: "external" | "hash";
}

export default function Link({ variant, ...linkProps }: Props) {
  if (variant === "hash") return <HashLink {...linkProps} />;
  else return <ExternalLink {...linkProps} />;
}
