import React, { type ReactNode } from "react";

interface Props {
  id: string;
  children: ReactNode; // label passed as children
}

export default function HashLink(props: Props) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // stop instant jump

    const el = document.getElementById(props.id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <a href={`#${props.id}`} onClick={handleClick}>
      {props.children}
    </a>
  );
}
