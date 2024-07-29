import { Itinerary } from "../models/itineraries.js";
import { Router } from "express";
import { isAuthenticated } from "../middleware/helpers.js";
import { ItineraryMember } from "../models/itineraryMembers.js";
import { Event } from "../models/events.js";
import { User } from "../models/users.js";

export const itinerariesRouter = Router();

const ITINERARIES_COLLECTION = "itineraries";

itinerariesRouter.post("/", isAuthenticated, async (req, res, next) => {
  try {
    if (!req.body.location) {
      return res.status(422).json({ error: "Location is required." });
    }
    if (!req.body.title) {
      return res.status(422).json({ error: "Title is required." });
    }
    if (!req.body.startDate) {
      return res.status(422).json({ error: "Start Date is required." });
    }
    if (!req.body.endDate) {
      return res.status(422).json({ error: "End Date is required." });
    }
    if (!req.body.description) {
      return res.status(422).json({ error: "Description is required." });
    }

    if (req.body.title.length > 75 || req.body.description > 250){
      return res.status(422).json({ error: "Title must be less than 15 characters and Description must be less than 250 characters." });
    }

    const userId = req.user.id;
    
    const user = await User.findByPk(userId)

    if (!user){
      return res.status(404).json({ error: "User is not found"})
    }

    if (user.tier === 1){
      const itineraryCount = await Itinerary.count({
        where: { UserId: userId }
      });
      if (itineraryCount === 3){
        return res.status(403).json({ error: "You have reached the maximum number of itinerary creations for Travel Trainee. Please return to home page." });
      }
    }
    
    const itinerary = await Itinerary.create({
      title: req.body.title,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      location: req.body.location,
      description: req.body.description,
      UserId: userId,
    });

    const itineraryMember = await ItineraryMember.create({
      UserId: userId,
      ItineraryId: itinerary.id,
    });

    return res.json(itinerary);
  } catch (e) {
    return res.status(500).json({ error: "Cannot Create Itinerary" });
  }
});

itinerariesRouter.post("/:id/event", isAuthenticated,async (req, res) => {
  try {
    const itineraryId = req.params.id;

    if (!itineraryId) {
      return res.status(422).json({ error: "itineraryId is required." });
    }
    const event = await Event.create({
      title: req.body.title,
      location: req.body.extendedProps.location,
      start: req.body.start,
      end: req.body.end,
      allDay: req.body.allDay,
      ItineraryId: itineraryId,
    });
    return res.json(event);
  } catch (e) {
    return res.status(404).json({ error: "Cannot Create Event" });
  }
});

itinerariesRouter.post("/:id/members", isAuthenticated,async (req, res) => {
  try {
    const itineraryId = req.params.id;
    const userId = req.body.id;

    if (!itineraryId) {
      return res.status(422).json({ error: "itineraryId is required." });
    }

    if (!userId) {
      return res.status(422).json({ error: "userId is required." });
    }

    const itineraryMember = await ItineraryMember.create({
      ItineraryId: itineraryId,
      UserId: userId,
    });

    return res.json(itineraryMember);
  } catch (e) {
    return res.status(404).json({ error: "Cannot Add User" });
  }
});

itinerariesRouter.delete("/:id/members/:userId", isAuthenticated,async (req, res) => {
  try {
    const itineraryId = req.params.id;
    const userId = req.params.userId;

    if (!itineraryId) {
      return res.status(422).json({ error: "itineraryId is required." });
    }

    if (!userId) {
      return res.status(422).json({ error: "userId is required." });
    }

    const deletedMember = await ItineraryMember.destroy({
      where: {
        ItineraryId: itineraryId,
        UserId: userId,
      },
    });

    if (deletedMember === 0) {
      return res.status(404).json({ error: "Member not found." });
    }

    return res.json({ message: "User removed from itinerary." });
  } catch (e) {
    return res.status(500).json({ error: "Cannot remove user from itinerary." });
  }
});




itinerariesRouter.delete("/:id", isAuthenticated,async (req, res) => {
  try {
    const itineraryId = req.params.id;
    const userId = req.user.id;

    if (!itineraryId) {
      return res.status(422).json({ error: "itineraryId is required." });
    }

    if (!userId) {
      return res.status(422).json({ error: "userId is required." });
    }

    const itinerary = await Itinerary.findOne({
      where: {
        id: itineraryId,
        UserId: userId,
      },
    });

    if (!itinerary) {
      return res.status(401).json({ error: "Not Authorized" });
    }


    const deletedItinerary = await Itinerary.destroy({
      where: {
        id: itineraryId,
        UserId: userId,
      },
    });
    

    if (deletedItinerary === 0) {
      return res.status(404).json({ error: "Itinerary not found." });
    }

    return res.json({ message: "Itinerary deleted." });
  } catch (e) {
    return res.status(500).json({ error: "Cannot remove itinerary." });
  }
});


// itinerariesRouter.get("/:id", async (req, res) => {
//   try {
//     const itineraryId = req.params.id

//     if (!itineraryId) {
//       return res.status(422).json({ error: "itineraryId is required." });
//     }

//     const itinerary = await Itinerary.findOne({
//       where: {
//         id: itineraryId,
//       }
//     });
//     return res.json(itinerary);

//   }catch (e){
//     return res.status(404).json({ error: "Cannot Find Itinerary" });
//   }
// });

itinerariesRouter.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const itineraryId = req.params.id;
    if (!itineraryId) {
      return res.status(422).json({ error: "itineraryId is required." });
    }

    const itineraryMember = await ItineraryMember.findOne({
      where: {
        ItineraryId: itineraryId,
        UserId: req.user.id,
      },
    });

    if (!itineraryMember) {
      return res.status(401).json({ error: "Not Authorized" });
    }

    const itineraryWithEvents = await Itinerary.findOne({
      where: { id: itineraryId },
      include: [
        {
          model: Event,
        },
      ],
    });
    return res.json(itineraryWithEvents);
  } catch (e) {
    return res.status(404).json({ error: "Cannot Find Itinerary" });
  }
});

itinerariesRouter.get("/:id/members", isAuthenticated, async (req, res, next) => {
  try {

    const itineraryId = req.params.id;

    if (!itineraryId) {
      return res.status(422).json({ error: "itineraryId is required." });
    }

    const itineraryMembers = await ItineraryMember.findAll({
      where: {
        ItineraryId: itineraryId,
      },
      include: {
        association: "User",
      },
    });

    const result = itineraryMembers.map((member) => ({
      id: member.User.id,
      username: member.User.username,
      profile: member.User.profile,
      itineraryId: member.ItineraryId,
    }));
    return res.json(result);
  } catch (e) {
    return res.status(404).json({ error: "Cannot Find Itinerary" });
  }
});

itinerariesRouter.get("/:id/owner", isAuthenticated, async (req, res, next) => {
  try {

    const itineraryId = req.params.id;

    if (!itineraryId) {
      return res.status(422).json({ error: "itineraryId is required." });
    }
    const itinerary = await Itinerary.findOne({
      where: {
        id: itineraryId,
      }
    });
    if (itinerary.UserId !== req.user.id) {
      return res.json(false);
    }

    return res.json(true);
  } catch (e) {
    return res.status(404).json({ error: "Cannot Find Itinerary" });
  }
});

itinerariesRouter.get("/users/:id", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(422).json({ error: "userId is required." });
    }

    const itineraries = await Itinerary.findAll({
      where: {
        UserId: userId,
      },
      order: [["createdAt", "ASC"]],
    });

    return res.json({ itineraries, length: itineraries.length });
  } catch (e) {
    return res.status(404).json({ error: "Cannot Find Users Itineraries" });
  }
});

itinerariesRouter.get("/",isAuthenticated,  async (req, res, next) => {
  try {
    const userId = req.user.id;

    const itineraryMembers = await ItineraryMember.findAll({
      where: { UserId: userId },
      include: [
        {
          association: "Itinerary",
          include: [
            {
              association: "User",
            },
          ],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    // Check if data is retrieved correctly
    if (!itineraryMembers || itineraryMembers.length === 0) {
      return res.status(404).json({ error: "No itineraries found" });
    }

    const result = itineraryMembers.map((member) => ({
      id: member.Itinerary.id,
      title: member.Itinerary.title,
      location: member.Itinerary.location,
      description: member.Itinerary.description,
      startDate: member.Itinerary.startDate,
      endDate: member.Itinerary.endDate,
      UserId: member.Itinerary.UserId,
      username: member.Itinerary.User.username,
      profile: member.Itinerary.User.profile,
    }));

    return res.json({ itineraries: result, length: result.length });
  } catch (e) {
    console.error("Error fetching itineraries:", e);
    return res.status(400).json({ error: "Cannot Find Itineraries" });
  }
});

itinerariesRouter.get("/:id/events", isAuthenticated, async (req, res, next) => {
  try {
    const itineraryId = req.params.id;
    const userId = req.user.id;

    const itineraryMembers = await ItineraryMember.findAll({
      where: { UserId: userId, ItineraryId: itineraryId },
      include: [
        {
          association: "Itinerary",
          include: [
            {
              association: "Event",
            },
          ],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    // Check if data is retrieved correctly
    if (!itineraryMembers || itineraryMembers.length === 0) {
      return res.status(404).json({ error: "No itineraries found" });
    }

    const result = itineraryMembers.map((member) => ({
      id: member.Itinerary.id,
      title: member.Itinerary.title,
      location: member.Itinerary.location,
      description: member.Itinerary.description,
      startDate: member.Itinerary.startDate,
      endDate: member.Itinerary.endDate,
      UserId: member.Itinerary.UserId,
      username: member.Itinerary.User.username,
      profile: member.Itinerary.User.profile,
    }));

    return res.json({ itineraries: result, length: result.length });
  } catch (e) {
    console.error("Error fetching itineraries:", e);
    return res.status(400).json({ error: "Cannot Find Itineraries" });
  }
});