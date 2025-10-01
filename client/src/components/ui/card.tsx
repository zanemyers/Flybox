/**
 * Props shared by both SlimCard and NormalCard components
 */
interface CardProps {
  icon: string; // Icon or emoji to display in the card
  title: string; // Card title
  description: string; // Card description text
  link: string; // URL for the card's button
  buttonText: string; // Text to display on the button
}

/**
 * SlimCard Component
 * A compact horizontal card layout with icon + text on the left and a button on the right.
 */
function SlimCard(props: CardProps) {
  return (
    <div className="row g-4 mt-2">
      <div className="col-12">
        <div className="card border-dashed shadow-sm">
          <div className="card-body d-flex align-items-center justify-content-between">
            {/* Left side: Icon + Text */}
            <div className="d-flex align-items-center">
              <div className="me-3 display-5">{props.icon}</div>
              <div>
                <h5 className="card-title mb-1">{props.title}</h5>
                <p className="card-text small mb-0">{props.description}</p>
              </div>
            </div>
            {/* Right side: Action Button */}
            <a href={props.link} className="btn btn-outline-secondary">
              {props.buttonText}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * NormalCard Component
 * A standard box card layout with large icon, title, description, and button.
 */
function NormalCard(props: CardProps) {
  return (
    <div className="col-md-6 mb-3">
      <div className="card h-100 shadow-sm">
        <div className="card-body">
          {/* Icon */}
          <div className="mb-3 display-1">{props.icon}</div>
          {/* Title */}
          <h5 className="card-title">{props.title}</h5>
          {/* Description */}
          <p className="card-text">{props.description}</p>
          {/* Button */}
          <a href={props.link} className="btn btn-primary">
            {props.buttonText}
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * Props for the main Card component
 */
interface Props extends CardProps {
  variant?: "slim" | "normal"; // Determines which layout to render, defaults to "normal"
}

/**
 * Main Card Component
 * Chooses between SlimCard and NormalCard based on the variant prop.
 */
export default function Card({ variant = "normal", ...cardProps }: Props) {
  return variant === "slim" ? (
    <SlimCard {...cardProps} />
  ) : (
    <NormalCard {...cardProps} />
  );
}
