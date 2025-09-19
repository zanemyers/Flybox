import React from "react";
import ReactMarkdown, { type Components } from "react-markdown";

import TableOfContents, { type Props as TocProps } from "../ui/tableOfContents";
import { AttributedImage, type AttributedImageProps } from "./images";

interface AboutSectionProps extends AttributedImageProps {
  heading: string;
  children: React.ReactNode;
  reverse?: boolean; // defaults to false
}

export function AboutSection({
  heading,
  children,
  reverse = false,
  ...imageProps
}: AboutSectionProps) {
  return (
    <section
      className={`row align-items-center ${reverse ? "flex-md-row-reverse" : ""}`}
    >
      <div className="col-md-6">
        <AttributedImage {...imageProps} />
      </div>
      <div className="col-md-6">
        <h2 className="h4 mb-3">{heading}</h2>
        {children}
      </div>
    </section>
  );
}

interface DocSectionProps {
  subSection?: boolean;
  title: string;
  p1?: string; // the fist p tag (description or overview)
  p2?: string; // the final p tag (conclusion)
  children: React.ReactNode;
}

export function DocSection(props: DocSectionProps) {
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

interface DocOverviewProps extends TocProps {
  title: string;
  icon?: string;
  children: React.ReactNode; // the intro paragraph(s)
}

export function DocOverview(props: DocOverviewProps) {
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
