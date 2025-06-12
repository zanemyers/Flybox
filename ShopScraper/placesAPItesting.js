import dotenv from "dotenv";
import { Place } from "@googlemaps/places";

dotenv.config();

const placeClient = new Place({
  key: process.env.MAPS_API_KEY,
});

const request = {
  textQuery: process.env.SEARCH_QUERY,
  fields: [
    "displayName",
    "primaryTypeDisplayName",
    "formattedAddress",
    "internationalPhoneNumber",
    "websiteURI",
    "rating",
    "userRatingCount",
  ],
  locationBias: { lat: process.env.SEARCH_LAT, lng: process.env.SEARCH_LONG },
};

const { places } = await placeClient.searchByText(request);

console.log("Places found:", places.length);
console.log(places);
