import { Event } from "../models/events.js";
import { Router } from "express";
import { isAuthenticated } from "../middleware/helpers.js";
import { ItineraryMember } from "../models/itineraryMembers.js";
import axios from "axios";

export const googleRouter = Router();

import fs from "fs";
import testData from "../test_data/data.json";

const apiKey = "AIzaSyBdj6gMDTgiD2Fybki9EUwbXYKi1oKFtek";

function getPhotoUrl(name) {
  // Example name format: "places/ChIJCar0f49ZwokR6ozLV-dHNTE/photos/AUc7tXXk_7VfIu9O-WlQdEPsT1FDJmcKbBvAj82DwijlcL4u6B_28usS3yDLWrayklDa8qm8kzZORwPx1DRd7fuLp24HhEuaEtt6vq7-Ab0OCd3XCzwxt7epHKD2GrAte-XsrVZ2JNVGPcCGfAAR8dzDyAdAQiG3FwsiRvSG"
  const parts = name.split("/");
  const photoReference = parts[parts.length - 1];

  const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;
  return photoUrl;
}

googleRouter.post("/places", isAuthenticated, async (req, res) => {
  const location = req.body.location;
  if (!location) {
    return res.status(400).json({ error: "location is required in the body." });
  }
  try {
    // uncomment to use google places api
    // const apiResponse = await axios.post('https://places.googleapis.com/v1/places:searchNearby', {
    //   "includedTypes": ["restaurant", "shopping_mall", "amusement_park", "casino", "aquarium", "historical_landmark"],
    //   "maxResultCount": 5,
    //   "locationRestriction": {
    //     "circle": {
    //       "center": {
    //         "latitude": location.lat,
    //         "longitude": location.lng},
    //       "radius": 1500.0
    //     }
    //   }
    // },{
    //   headers: {
    //     // Any required headers here
    //     'Content-Type': 'application/json',
    //     'X-Goog-Api-Key': 'AIzaSyBdj6gMDTgiD2Fybki9EUwbXYKi1oKFtek',
    //     'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.photos,places.location'
    //   }
    // });
    // console.log(apiResponse.data)
    // fs.writeFile('data.json', JSON.stringify(apiResponse.data, null, 2), (err) => {
    //   if (err) {
    //     console.error('Error writing file:', err);
    //     return res.status(500).json({ error: "Error writing data to file" });
    //   }
    //   console.log('Data written to file successfully');
    // });
    console.log("here is the final data");
    // const newData = apiResponse.data.places.map((place) => {
    const newData = testData.places.map((place) => {
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
    console.log(error);
    // Handle potential errors, such as validation errors or database errors
    return res.status(500).json({ error: "Cannot recommend events" });
  }
});
