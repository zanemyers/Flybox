import dotenv from "dotenv";
import { PlacesClient, SearchNearbyRankPreference } from "@googlemaps/places";

dotenv.config();

const placesClient = new PlacesClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
});

// Restrict within the map viewport.
let center = new google.maps.LatLng(
  process.env.SEARCH_LAT,
  process.env.SEARCH_LONG
);
const request = {
  // required parameters
  fields: ["place_id", "displayName"],
  locationRestriction: {
    center: center,
    radius: process.env.SEARCH_RADIUS,
  },
  // optional parameters
  maxResultCount: process.env.MAX_RESULTS || 20,
  rankPreference: SearchNearbyRankPreference.POPULARITY,
  language: "en-US",
  region: "us",
};
//@ts-ignore
const { places } = await placesClient.searchNearby(request);
