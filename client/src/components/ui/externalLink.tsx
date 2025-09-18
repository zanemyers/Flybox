import React from "react";

interface Props {
  url: string;
  children: React.ReactNode;
}

export default function ExternalLink(props: Props) {
  return (
    <a href={props.url} target="_blank" rel="noopener noreferrer">
      {props.children}
    </a>
  );
}
