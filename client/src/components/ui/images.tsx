export interface ImageProps {
  img: string;
  alt: string;
  url?: string;
  attribution?: string;
}

function AttributedImage(props: ImageProps) {
  return (
    <>
      <img src={props.img} alt={props.alt} className="img-fluid" />
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

function CenteredImage(props: ImageProps) {
  return (
    <div className="d-flex justify-content-center pb-3">
      <img src={props.img} alt={props.alt} />
    </div>
  );
}

interface Props extends ImageProps {
  variant?: "attributed" | "centered";
}

export default function Image({ variant = "centered", ...imageProps }: Props) {
  if (variant === "attributed") return <AttributedImage {...imageProps} />;
  else return <CenteredImage {...imageProps} />;
}
