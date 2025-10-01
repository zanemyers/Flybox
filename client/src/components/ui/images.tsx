/**
 * Props for both AttributedImage and CenteredImage components
 */
export interface ImageProps {
  img: string; // Image source URL
  alt: string; // Alt text for accessibility
  url?: string; // Optional URL for attribution link
  attribution?: string; // Optional attribution text
}

/**
 * AttributedImage Component
 * Displays an image with an optional attribution link below it.
 */
function AttributedImage(props: ImageProps) {
  return (
    <>
      {/* Main image */}
      <img src={props.img} alt={props.alt} className="img-fluid" />

      {/* Attribution text/link */}
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

/**
 * CenteredImage Component
 * Centers the image horizontally without any attribution.
 */
function CenteredImage(props: ImageProps) {
  return (
    <div className="d-flex justify-content-center pb-3">
      <img src={props.img} alt={props.alt} />
    </div>
  );
}

/**
 * Props for the main Image component
 */
interface Props extends ImageProps {
  variant?: "attributed" | "centered"; // Determines which layout to render
}

/**
 * Main Image Component
 * Chooses between AttributedImage and CenteredImage based on the variant prop.
 * Defaults to "centered" layout if variant is not provided.
 */
export default function Image({ variant = "centered", ...imageProps }: Props) {
  if (variant === "attributed") return <AttributedImage {...imageProps} />;
  else return <CenteredImage {...imageProps} />;
}
