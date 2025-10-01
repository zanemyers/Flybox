import Card from "../components/ui/card";

/**
 * Home Page Component
 *
 * Displays the Flybox homepage with a hero section, quick access
 * to tools (ShopReel, FishTales, SiteScout), documentation, and
 * a short description of the platform’s value.
 */
export default function Home() {
  return (
    <>
      {/* Hero Section: Main headline and introductory text */}
      <section className="position-relative text-center py-4 mb-5">
        <div className="container position-relative text-primary">
          <h2 className="display-6 fw-bold mb-3">Discover Fly Fishing Shops & Reports</h2>
          <p className="lead mb-0">
            Access up-to-date data and insights to enhance your fly-fishing adventures.
          </p>
        </div>
      </section>

      {/* Tools Section: Quick access cards for Flybox tools */}
      <section id="tools" className="container">
        <div className="row g-4 text-center">
          {/* ShopReel: Scraper for finding local fly-fishing shops */}
          <Card
            icon="🎣"
            title="ShopReel"
            description="Find fly-fishing shops near you!"
            link="/shopReel"
            buttonText="Cast for Details"
          />
          {/* FishTales: Aggregates latest fly-fishing reports */}
          <Card
            icon="🐟"
            title="FishTales"
            description="Get the latest fly-fishing reports for your area"
            link="/fishTales"
            buttonText="Catch the Latest"
          />
        </div>

        {/* SiteScout: Discover new fly-fishing sites */}
        <Card
          variant="slim"
          icon="🗺️"
          title="SiteScout"
          description="Discover new fly-fishing sites."
          link="/siteScout"
          buttonText="Check your sites"
        />
        {/* Docs: Access Flybox documentation */}
        <Card
          variant="slim"
          icon="📚️"
          title="Docs"
          description="Learn how to use Flybox tools."
          link="/docs"
          buttonText="Read"
        />
      </section>

      {/* Value Proposition Section: Explains Flybox benefits */}
      <section className="text-primary text-center mt-5 pt-5">
        <div className="container">
          <h3>Connect Shops & Reports Effortlessly</h3>
          <p>
            Flybox simplifies your fly-fishing planning by combining shop locations and the latest
            reports in one place.
          </p>
        </div>
      </section>
    </>
  );
}
