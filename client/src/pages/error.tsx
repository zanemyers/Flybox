import calvinGif from "@images/calvin-fishing.gif";

interface Props {
  statusCode: number;
  heading?: string;
  message?: string;
}

export default function ErrorPage(props: Props) {
  return (
    <main className="container text-center py-0">
      {/* Large status code display (e.g., 404, 500) */}
      <h1 className="display-2 mb-3 text-secondary">
        <b>{props.statusCode}</b>
      </h1>

      {/* Optional heading with default" */}
      <h1 className="display-6">{props.heading || "Gone Fishing..."}</h1>

      {/* Optional descriptive message with default */}
      <p className="lead">
        {props.message ||
          "Looks like the page you were trying to find has drifted downstream."}
      </p>

      {/* Image/gif illustration */}
      <div
        className="my-4 text-center"
        style={{ maxWidth: "300px", margin: "0 auto" }}
      >
        <img src={calvinGif} alt="Fishing Gif" className="img-fluid rounded" />
      </div>

      {/* Call-to-action button back to home page */}
      <a href="/client/static" className="btn btn-primary btn-lg px-4">
        Cast a Line Back App
      </a>
    </main>
  );
}
