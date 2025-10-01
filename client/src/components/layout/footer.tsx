/**
 * Footer component
 *
 * Renders a simple page footer with copyright information and a small credit.
 * Uses Bootstrap utility classes for styling.
 */
export default function Footer() {
  return (
    <footer className="bg-light text-center text-muted border-top">
      <div className="container">
        <small>
          &copy; 2025 Zane Myers — All rights reserved.
          <br />
          Built with ❤️ for the Rescue River team.
        </small>
      </div>
    </footer>
  );
}
