import { Event } from "../models/events.js";
import { Router } from "express";
import { isAuthenticated } from "../middleware/helpers.js";
import { ItineraryMember } from "../models/itineraryMembers.js";

export const eventsRouter = Router();

eventsRouter.get("/:id", async (req, res) => {
  const eventId = req.params.id
  if (!eventId){
    return res.status(422).json({ error: "eventId is required." });
  }
  try {
    const event = await Event.findByPk(eventId);
    if (!event){
      return res.status(404).json({error: "Event not found"})
    }
    return res.json(event)
  } catch (error) {
    return res.status(500).json({error: error})
  }
})

eventsRouter.patch("/:id", async (req, res) => {
  const eventId = req.params.id
  if (!eventId){
    return res.status(422).json({ error: "eventId is required." });
  }
  
  try {
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event Cannot Be Found" });
    }
    console.log("here")
    console.log(req.body)
    // Assuming `req.body` contains the fields to update
    const updatedEvent = await event.update({
      title: req.body.title ? req.body.title : event.title,
      location: req.body.extendedProps.location ? req.body.extendedProps.location : event.location,
      start: req.body.start ? req.body.start : event.start,
      end: req.body.end ? req.body.end : event.end,
      allDay: req.body.allDay ? req.body.allDay : event.allDay
    });
    console.log("lmao")
    console.log(updatedEvent)

    return res.json(updatedEvent);
  } catch (error) {
    // Handle potential errors, such as validation errors or database errors
    return res.status(500).json({ error: "Cannot Update The Given Event" });
  }
})

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


