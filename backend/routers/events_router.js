import { Event } from "../models/events.js";
import { Router } from "express";
import { isAuthenticated } from "../middleware/helpers.js";
import { ItineraryMember } from "../models/itineraryMembers.js";

export const eventsRouter = Router();

eventsRouter.delete("/:id", async (req, res) => {
  const eventId = req.params.id
  if (!eventId){
    return res.status(422).json({ error: "eventId is required." });
  }
  
  const event = await Event.findByPk(eventId)
  if (!event){
    return res.status(404).json({error: "Event Cannot Be Found"})
  }

  await event.destroy();
  return res.json(event);
})


