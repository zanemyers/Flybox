import ReactMarkdown from "react-markdown";
import React from "react";

interface ListItems {
  label?: string;
  main?: string | React.ReactNode;
  noteLabel?: string;
  note?: string | React.ReactNode;
  img?: string;
  alt?: string;
  children?: ListItems[]; // allow nesting
}

interface Props {
  items: ListItems[];
  ordered?: boolean;
  orderChild?: boolean;
  extraClass?: string;
}

export default function ListBlock(props: Props) {
  const ListTag = props.ordered ? "ol" : "ul";

  return (
    <ListTag className={props.extraClass}>
      {props.items.map((item, index) => (
        <li key={index} className={item.img ? "mb-4" : ""}>
          {/* Only render label if it exists */}
          {item.label && (
            <strong>
              {item.label}
              {item.main && ": "}
            </strong>
          )}

          {/* Render main if it exists and Handle string vs. ReactNode for main */}
          {item.main &&
            (typeof item.main === "string" ? (
              <ReactMarkdown components={{ p: "span" }}>
                {item.main}
              </ReactMarkdown>
            ) : (
              item.main
            ))}

          {/* Render note if it exists and Handle string vs. ReactNode for note */}
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

          {/* Render igm if it exists */}
          {item.img && (
            <>
              <br />
              <img src={item.img} alt={item.alt} />
            </>
          )}

          {/* Recursive render if nested items exist */}
          {item.children && (
            <ListBlock items={item.children} ordered={props.orderChild} />
          )}
        </li>
      ))}
    </ListTag>
  );
}
