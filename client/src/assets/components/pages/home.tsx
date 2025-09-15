import { Card } from "./card";

export function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="position-relative text-center py-4 mb-5">
        <div className="container position-relative text-primary">
          <h2 className="display-6 fw-bold mb-3">
            Discover Fly Fishing Shops & Reports
          </h2>
          <p className="lead mb-0">
            Access up-to-date data and insights to enhance your fly-fishing
            adventures.
          </p>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="container">
        <div className="row g-4 text-center">
          {/* ShopReel Scraper */}
          <Card
            icon="🎣"
            title="ShopReel"
            description="Find fly-fishing shops near you!"
            link="/shopReel"
            buttonText="Cast for Details"
          />
          {/* FishTales Scraper */}
          <Card
            icon="🐟"
            title="FishTales"
            description="Get the latest fly-fishing reports for your area"
            link="/fishTales"
            buttonText="Catch the Latest"
          />
        </div>

        {/* Site Scout */}
        <Card
          slim={true}
          icon="🗺️"
          title="SiteScout"
          description="Discover new fly-fishing sites."
          link="/siteScout"
          buttonText="Check your sites"
        />
        {/* Docs */}
        <Card
          slim={true}
          icon="📚️"
          title="Docs"
          description="Learn how to use Flybox tools."
          link="/docs"
          buttonText="Read"
        />
      </section>

      <section className="text-primary text-center mt-5 pt-5">
        <div className="container">
          <h3>Connect Shops & Reports Effortlessly</h3>
          <p>
            Flybox simplifies your fly-fishing planning by combining shop
            locations and the latest reports in one place.
          </p>
        </div>
      </section>
    </>
  );
}
