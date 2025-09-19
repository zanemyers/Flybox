export interface AttributedImageProps {
  image: string;
  alt: string;
  url: string;
  attribution: string;
}

export function AttributedImage(props: AttributedImageProps) {
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

interface DocImageProps {
  img: string;
  alt: string;
}

// Used for non-list images in the docs
export function DocImage(props: DocImageProps) {
  return (
    <div className="d-flex justify-content-center pb-3">
      <img src={props.img} alt={props.alt} />
    </div>
  );
}
