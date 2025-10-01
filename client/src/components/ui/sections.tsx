import React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import TableOfContents, { type Props as TocProps } from "../ui/tableOfContents";
import Image, { type ImageProps } from "./images";

/**
 * Props for AboutSection component
 */
interface AboutSectionProps extends ImageProps {
  heading: string; // Section heading text
  children: React.ReactNode; // Section content (typically paragraphs, lists, etc.)
  reverse?: boolean; // If true, image appears on the right (default: false)
}

/**
 * AboutSection component
 *
 * Displays a section with an image and content side-by-side.
 * Supports reversing the order of image and content for layout flexibility.
 */
export function AboutSection({
  heading,
  children,
  reverse = false,
  ...imageProps
}: AboutSectionProps) {
  return (
    <section
      className={`row align-items-center ${reverse ? "flex-md-row-reverse" : ""}`} // Flex direction controlled by reverse
    >
      {/* Image column */}
      <div className="col-md-6">
        {/* Attributed image component */}
        <Image variant="attributed" {...imageProps} />{" "}
      </div>

      {/* Text/content column */}
      <div className="col-md-6">
        <h2 className="h4 mb-3">{heading}</h2>
        {children}
      </div>
    </section>
  );
}

/**
 * Props for DocSection component
 */
interface DocSectionProps {
  subSection?: boolean; // If true, renders a smaller header (h5) and inline overview
  title: string; // Section title
  overview?: string; // Optional overview text (Markdown)
  conclusion?: string; // Optional conclusion text (Markdown)
  children: React.ReactNode; // Section content
}

/**
 * DocSection component
 *
 * Represents a section of documentation with optional overview and conclusion.
 * Can be rendered as a subsection with smaller header tags.
 */
export function DocSection(props: DocSectionProps) {
  const id = props.title.toLowerCase().replace(/ /g, "-"); // Generate HTML id for anchor links
  const HeaderTag = props.subSection ? "h5" : "h3"; // Smaller header if subsection
  const overviewComponent: Components | null = props.subSection
    ? { p: "span" } // Render overview paragraphs inline if subsection
    : null;

  return (
    <section id={id} className="mb-2">
      {/* Section header */}
      <HeaderTag className="pt-2">{props.title}</HeaderTag>

      {/* Optional overview rendered with Markdown */}
      {props.overview && (
        <ReactMarkdown components={overviewComponent}>
          {props.overview}
        </ReactMarkdown>
      )}

      {/* Main section content */}
      {props.children}

      {/* Optional conclusion rendered with Markdown */}
      {props.conclusion && <ReactMarkdown>{props.conclusion}</ReactMarkdown>}
    </section>
  );
}

/**
 * Props for DocOverview component
 */
interface DocOverviewProps extends TocProps {
  title: string; // Main documentation title
  icon?: string; // Optional icon for visual enhancement
  children: React.ReactNode; // Typically overview paragraph or introductory content
}

/**
 * DocOverview component
 *
 * Renders the main overview for a documentation page including a title, optional icon,
 * optional overview paragraph, and a table of contents.
 */
export function DocOverview(props: DocOverviewProps) {
  return (
    <>
      {/* Page title with optional icon */}
      <h1>
        {props.icon} {props.title} Documentation
      </h1>

      {/* Introductory overview paragraph */}
      {props.children}

      <hr />

      {/* Table of contents */}
      <TableOfContents items={props.items} />
    </>
  );
}
