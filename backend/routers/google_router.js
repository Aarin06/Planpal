import { Router } from "express";
import { isAuthenticated } from "../middleware/helpers.js";
import { config } from "dotenv";

export const googleRouter = Router();

// import testData from "../test_data/data.json" assert { type: "json" };

config();
console.log("google_router.js")
console.log(process.env.GOOGLE_CLIENT_ID)
console.log(process.env.GOOGLE_CLIENT_SECRET)
console.log(process.env.GOOGLE_PLACES_API_KEY)
console.log(process.env.STRIPE_SECRET_KEY)
console.log(process.env.SESSION_SECRET)
const apiKey = process.env.GOOGLE_PLACES_API_KEY;

function getPhotoUrl(name) {
  const parts = name.split("/");
  const photoReference = parts[parts.length - 1];

  const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;
  return photoUrl;
}

googleRouter.post("/places", isAuthenticated, async (req, res) => {
  const location = req.body.location;
  const includedTypes = req.body.includedTypes
  if (!location || !includedTypes) {
    return res.status(400).json({ error: "location and includedTypes is required in the body." });
  }
  let googleIncludedTypes = ["restaurant"]
  ['Restaurants', 'Hotels', 'Things to do', 'Museum']
  switch (includedTypes) {
    case "Restaurants":
      googleIncludedTypes=["restaurant"]
      break;
    case "Hotels":
      googleIncludedTypes=["hotel", "lodging", "motel", "resort_hotel"]
      break;
    case "Things to do":
      googleIncludedTypes=["shopping_mall", "amusement_park", "casino", "aquarium", "night_club", "zoo", "park"]
      break;
    case "Museum":
      googleIncludedTypes=["museum", "art_gallery", "historical_landmark"]
      break;
    default:
  }
  try {
    // uncomment to use google places api
    const apiResponse = await axios.post('https://places.googleapis.com/v1/places:searchNearby', {
      "includedTypes": googleIncludedTypes,
      "maxResultCount": 5,
      "locationRestriction": {
        "circle": {
          "center": {
            "latitude": location.lat,
            "longitude": location.lng},
          "radius": 1500.0
        }
      }
    },{
      headers: {
        // Any required headers here
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.photos,places.location'
      }
    });
    const newData = apiResponse.data.places.map((place) => {
    // const newData = testData.places.map((place) => {
      return {
        title: place.displayName.text,
        start: new Date(),
        end: new Date(),
        allDay: true,
        location: {
          name: place.displayName.text,
          address: place.formattedAddress,
          iconUrl: "",
          imageUrl: getPhotoUrl(place.photos[0].name, apiKey),
          location: {
            lat: place.location.latitude,
            lng: place.location.longitude,
          },
        },
      };
    });
    return res.json(newData);
  } catch (error) {
    // Handle potential errors, such as validation errors or database errors
    return res.status(500).json({ error: "Cannot recommend events" });
  }
});
