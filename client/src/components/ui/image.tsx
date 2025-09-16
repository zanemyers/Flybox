export interface Props {
  image: string;
  alt: string;
  url: string;
  attribution: string;
}

export default function Image(props: Props) {
  return (
    <>
      <img src={props.image} alt={props.alt} className="img-fluid" />
      <p className="small text-center">
        <a
          href={props.url}
          target="_blank"
          rel="noopener noreferrer"
          className="small"
          style={{ color: "rgba(0,0,0,0.25)", textDecoration: "none" }}
        >
          {props.attribution}
        </a>
      </p>
    </>
  );
}
