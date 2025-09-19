import Link from "./links";

interface TocItem {
  label: string;
  children?: TocItem[];
}

export interface Props {
  items: TocItem[];
}

export default function TableOfContents({ items }: Props) {
  const generateId = (label: string) =>
    label.toLowerCase().replace(/\s+/g, "-");

  const renderItems = (items: TocItem[]) => (
    <ul>
      {items.map((item) => {
        const target = generateId(item.label);

        return (
          <li key={target}>
            <Link variant="hash" target={target}>
              {item.label}
            </Link>
            {item.children && renderItems(item.children)}
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <h3>Contents</h3>
      {renderItems(items)}
    </>
  );
}
