import Home from "./home";
import About from "./about";
import Docs from "./docs";
import FishTales from "./fishTales";
import ShopReel from "./shopReel";
import SiteScout from "./siteScout";

// Export components individually for named imports
export { Home, About, Docs, FishTales, ShopReel, SiteScout };

// Automatically generate routes
export const routes = [
  { path: "/", element: Home },
  { path: "/about", element: About },
  { path: "/docs", element: Docs },
  { path: "/fishTales", element: FishTales },
  { path: "/shopReel", element: ShopReel },
  { path: "/siteScout", element: SiteScout },
];
