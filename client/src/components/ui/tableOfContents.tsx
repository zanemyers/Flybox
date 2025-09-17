import HashLink from "./hashLink";

interface TocItem {
  label: string;
  children?: TocItem[];
}

interface Props {
  items: TocItem[];
}

export default function TableOfContents({ items }: Props) {
  const generateId = (label: string) =>
    label.toLowerCase().replace(/\s+/g, "-");

  const renderItems = (items: TocItem[]) => (
    <ul>
      {items.map((item) => {
        const id = generateId(item.label);

        return (
          <li key={id}>
            <HashLink id={id}>{item.label}</HashLink>
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
