/*
 * This script uses the Google Places API to search for places based on a text query.
 * It retrieves places within a specified radius around a given latitude and longitude.
 * The results include details such as display name, types, phone number, website, rating, and user rating count.
 * The API key and search parameters are loaded from environment variables.
 *
 * NOTE: Google's new Places API currently returns a maximum of 20 results per request.
 *       Until Google adds support for pagination or increases this limit,
 *       this script will remain in beta status on the `google-places-api` development branch.
 */

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function searchPlacesText() {
  try {
    const response = await axios.post(
      "https://places.googleapis.com/v1/places:searchText",
      {
        textQuery: process.env.SEARCH_QUERY,
        locationBias: {
          circle: {
            center: {
              latitude: parseFloat(process.env.SEARCH_LAT),
              longitude: parseFloat(process.env.SEARCH_LONG),
            },
            radius: 50000,
          },
        },
        maxResultCount: 50,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.MAPS_API_KEY,
          "X-Goog-FieldMask":
            "places.displayName,places.types,places.internationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount",
        },
      }
    );

    return response.data.places || [];
  } catch (error) {
    // Axios error handling
    if (error.response) {
      throw new Error(
        `Places API error: ${JSON.stringify(error.response.data)}`
      );
    } else {
      throw new Error(`Request error: ${error.message}`);
    }
  }
}

const places = await searchPlacesText();

console.log("Places found:", places.length);
console.log(places);
