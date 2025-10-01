import Link from "./links";

/**
 * Represents a single item in the table of contents.
 */
interface TocItem {
  label: string; // The text to display for this item
  children?: TocItem[]; // Optional nested sub-items
}

/**
 * Props for the TableOfContents component
 */
export interface Props {
  items: TocItem[]; // Array of top-level TOC items
}

/**
 * TableOfContents component
 *
 * Renders a hierarchical table of contents using nested <ul> elements.
 * Each item is a clickable link that scrolls to the corresponding section
 * (assumes section IDs are derived from labels).
 */
export default function TableOfContents({ items }: Props) {
  /**
   * Generate a DOM ID from a label string.
   * Converts to lowercase and replaces spaces with hyphens.
   */
  const generateId = (label: string) =>
    label.toLowerCase().replace(/\s+/g, "-");

  /**
   * Recursively render TOC items and their children.
   */
  const renderItems = (items: TocItem[]) => (
    <ul>
      {items.map((item) => {
        const target = generateId(item.label); // ID to scroll to

        return (
          <li key={target}>
            {/* Use the HashLink variant to scroll to section */}
            <Link variant="hash" target={target}>
              {item.label}
            </Link>

            {/* Recursively render children if they exist */}
            {item.children && renderItems(item.children)}
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Section header */}
      <h3>Contents</h3>

      {/* Render all TOC items */}
      {renderItems(items)}
    </>
  );
}
