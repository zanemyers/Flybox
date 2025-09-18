interface Props {
  img: string;
  alt: string;
}

// Used for non-list images in the docs
export default function DocImage(props: Props) {
  return (
    <div className="d-flex justify-content-center pb-3">
      <img src={props.img} alt={props.alt} />
    </div>
  );
}
