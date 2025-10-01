import ReactMarkdown from "react-markdown";
import React from "react";

/**
 * Interface for individual list items.
 * Supports labels, main content, notes, images, and nested children.
 */
interface ListItems {
  label?: string; // Optional label, rendered in bold
  main?: string | React.ReactNode; // Main content, can be a string or ReactNode
  noteLabel?: string; // Optional label for the note, rendered in italics
  note?: string | React.ReactNode; // Optional note content, string or ReactNode
  img?: string; // Optional image URL
  alt?: string; // Alt text for the image
  children?: ListItems[]; // Nested list items for recursive rendering
}

/**
 * Props for the ListBlock component
 */
interface Props {
  items: ListItems[]; // Array of list items to render
  ordered?: boolean; // Whether the list is ordered (<ol>) or unordered (<ul>)
  orderChild?: boolean; // Whether nested children should be ordered
  extraClass?: string; // Optional extra CSS class applied to the outer <ul> or <ol>
}

/**
 * ListBlock component
 *
 * Renders a customizable list with optional labels, notes, images, and nested items.
 * - Supports Markdown rendering for string content via ReactMarkdown.
 * - Supports nested lists recursively.
 */
export default function ListBlock(props: Props) {
  const ListTag = props.ordered ? "ol" : "ul"; // Decide tag based on ordered prop

  return (
    <ListTag className={props.extraClass}>
      {props.items.map((item, index) => (
        <li key={index} className={item.img ? "mb-4" : ""}>
          {/* Render the label in bold if it exists, followed by colon if main exists */}
          {item.label && (
            <strong>
              {item.label}
              {item.main && ": "}
            </strong>
          )}

          {/* Render main content */}
          {item.main &&
            (typeof item.main === "string" ? (
              // If it's a string, render via ReactMarkdown (inline)
              <ReactMarkdown components={{ p: "span" }}>
                {item.main}
              </ReactMarkdown>
            ) : (
              // Otherwise, render directly as ReactNode
              item.main
            ))}

          {/* Render note if it exists */}
          {item.note && (
            <>
              <br />
              {item.noteLabel && <em>{item.noteLabel}: </em>}
              {typeof item.note === "string" ? (
                <ReactMarkdown components={{ p: "span" }}>
                  {item.note}
                </ReactMarkdown>
              ) : (
                item.note
              )}
            </>
          )}

          {/* Recursively render children if nested items exist */}
          {item.children && (
            <ListBlock items={item.children} ordered={props.orderChild} />
          )}

          {/* Render image if provided */}
          {item.img && (
            <>
              <img src={item.img} alt={item.alt} />
            </>
          )}
        </li>
      ))}
    </ListTag>
  );
}
