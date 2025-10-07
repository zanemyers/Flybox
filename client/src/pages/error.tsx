import calvinGif from "@assets/images/calvin-fishing.gif";

interface Props {
  statusCode: number; // HTTP status code to display (e.g., 404, 500)
  heading?: string; // Optional heading text
  message?: string; // Optional descriptive message
}

/**
 * ErrorPage Component
 *
 * Displays a friendly error page for given HTTP status codes.
 * Includes an optional heading, message, illustrative gif, and
 * a button to navigate back to the home page.
 */
export default function ErrorPage(props: Props) {
  return (
    <main className="container text-center py-0">
      {/* Large status code display (e.g., 404, 500) */}
      <h1 className="display-2 mb-3 text-secondary">
        <b>{props.statusCode}</b>
      </h1>

      {/* Optional heading with default fallback */}
      <h1 className="display-6">{props.heading || "Gone Fishing..."}</h1>

      {/* Optional descriptive message with default fallback */}
      <p className="lead">
        {props.message || "Looks like the page you were trying to find has drifted downstream."}
      </p>

      {/* Image/gif illustration */}
      <div className="my-4 text-center" style={{ maxWidth: "300px", margin: "0 auto" }}>
        <img src={calvinGif} alt="Fishing Gif" className="img-fluid rounded" />
      </div>

      {/* Call-to-action button back to the home page */}
      <a href="/" className="btn btn-primary btn-lg px-4">
        Cast a Line Back App
      </a>
    </main>
  );
}
