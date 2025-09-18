import React from "react";
import ReactMarkdown, { type Components } from "react-markdown";

interface SectionProps {
  subSection?: boolean;
  title: string;
  p1?: string; // the fist p tag (description or overview)
  p2?: string; // the final p tag (conclusion)
  children: React.ReactNode;
}

export default function DocSection(props: SectionProps) {
  const id = props.title.toLowerCase().replace(/ /g, "-");
  const HeaderTag = props.subSection ? "h5" : "h3";
  const p1Component: Components | null = props.subSection
    ? { p: "span" }
    : null;

  return (
    <section id={id} className="mb-2">
      <HeaderTag className="pt-2">{props.title}</HeaderTag>
      {props.p1 && (
        <ReactMarkdown components={p1Component}>{props.p1}</ReactMarkdown>
      )}
      {props.children}
      {props.p2 && <ReactMarkdown>{props.p2}</ReactMarkdown>}
    </section>
  );
}
