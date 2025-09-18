import React from "react";
import TableOfContents, { type Props as TocProps } from "../ui/tableOfContents";

interface Props extends TocProps {
  title: string;
  icon?: string;
  children: React.ReactNode; // the intro paragraph(s)
}

export default function DocOverview(props: Props) {
  return (
    <>
      <h1>
        {props.icon} {props.title} Documentation
      </h1>
      {props.children}

      <hr />

      {/* Table of contents */}
      <TableOfContents items={props.items} />
    </>
  );
}
