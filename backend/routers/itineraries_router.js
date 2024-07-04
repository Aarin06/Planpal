import { Itinerary } from "../models/itineraries.js";
import { Router } from "express";
import { isAuthenticated } from "../middleware/helpers.js";
import { ItineraryMember } from "../models/itineraryMembers.js";
// import db from "../firebase.js";



export const itinerariesRouter = Router();

const ITINERARIES_COLLECTION = "itineraries";

// itinerariesRouter.post("/", async (req, res) => {
//   // console.log(req.body)
//   // if (!req.body) {
//   //   return res.status(400).json({ error: "Request is missing a body" });
//   // }
//   // const { title, users } = req.body;
//   // try {
//   //   const docRef = await db.collection('itineraries').add({title, users});
//   //   console.log(docRef);
//   //   return res.json({ id: docRef.id });
//   // } catch (error) {
//   //   return res.status(500).json({ error: error.message });
//   // }
//   // const { name, status } = req.body
//   // console.log(name, status)
//   // const peopleRef = db.collection('people').doc('associates')
//   // console.log(peopleRef)
//   // res.json({pll: "ok"})

//   // Data to be added
//   const docData = {
//     name: 'John Doe',
//     age: 30,
//     email: 'johndoe@example.com'
//   };

//   // Add a new document with a generated ID to 'users' collection
//   const addDoc = async () => {
//     try {
//       const res = await db.collection('users').add(docData);
//       console.log('Document written with ID: ', res.id);
//     } catch (error) {
//       console.error('Error adding document: ', error);
//     }
//   }
//   addDoc();
// });



itinerariesRouter.post("/", async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      console.log("ERRORRR")
      return res.status(401).json({ errors: "Not Authenticated" });
    }
    console.log(req.body)
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
    if (!req.body.locationPhotoUrl) {
      return res.status(422).json({ error: "locationPhotoUrl is required." });
    }
    const userId = req.user.id;

    const itinerary = await Itinerary.create({
      title:req.body.title,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      location: req.body.location,
      locationPhotoUrl: req.body.locationPhotoUrl,
      description: req.body.description,
      UserId: userId
    });

    console.log(itinerary.id)

    const itineraryMember = await ItineraryMember.create({
      UserId: userId,
      ItineraryId: itinerary.id
    });

    console.log(itineraryMember)


    return res.json(itinerary);

  }catch (e){
    return res.status(404).json({ error: "Cannot Create Itinerary" });
  }
});

itinerariesRouter.get("/:id", async (req, res, next) => {
  try {
    const itineraryId = req.params.id

    if (!itineraryId) {
      return res.status(422).json({ error: "itineraryId is required." });
    }
    
    const itinerary = await Itinerary.findOne({
      where: {
        id: itineraryId,
      }
    });
    console.log("test")
    return res.json(itinerary);

  }catch (e){
    return res.status(404).json({ error: "Cannot Find Itinerary" });
  }
});

itinerariesRouter.get("/:id/members", async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      console.log("ERRORRR")
      return res.status(401).json({ errors: "Not Authenticated" });
    }
    console.log("test")

    const itineraryId = req.params.id

    if (!itineraryId) {
      return res.status(422).json({ error: "itineraryId is required." });
    }
    console.log("help")
    
    const itineraryMembers = await ItineraryMember.findAll({
      where: {
        ItineraryId: itineraryId,
      },
      include: {
        association:"User"
      }
    });
    console.log("here",itineraryMembers)

    const result = itineraryMembers.map(member => ({
      userId: member.User.id,
      username: member.User.username,
      profile: member.User.profile,
      itineraryId: member.ItineraryId
    }));
    console.log(result)
    return res.json(result);

  }catch (e){
    return res.status(404).json({ error: "Cannot Find Itinerary" });
  }
});

itinerariesRouter.get("/users/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;
    const limit = parseInt(req.query.limit, 10) || 8;
    const page = parseInt(req.query.page, 10) || 1;
    const offset = (page - 1) * limit;

    if (!userId) {
      return res.status(422).json({ error: "userId is required." });
    }
    
    const itineraries = await Itinerary.findAll({
      where: {
        UserId: userId,
      },
      limit: limit,
      offset: offset,
      order: [["createdAt", "ASC"]],
    });

    return res.json({itineraries, length: itineraries.length});

  }catch (e){
    return res.status(404).json({ error: "Cannot Find Users Itineraries" });
  }
});

itinerariesRouter.get("/", async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 8;
    const page = parseInt(req.query.page, 10) || 1;
    const offset = (page - 1) * limit;
    const userId = req.user.id;

    const itineraries = await Itinerary.findAll({
      where:{UserId:userId},
      limit: limit,
      offset: offset,
      include: {
        association:"User"
      },
      order: [["createdAt", "ASC"]],
    });

    const result = itineraries.map(itinerary => ({
      id:itinerary.id,
      title:itinerary.title,
      location:itinerary.location,
      locationPhotoUrl:itinerary.locationPhotoUrl || "",
      description:itinerary.description,
      startDate:itinerary.startDate,
      endDate:itinerary.endDate,
      UserId:itinerary.UserId,
      username: itinerary.User.username,
      profile: itinerary.User.profile,
    }));
    console.log("get results",result)

    return res.json({itineraries:result,length: result.length});

  }catch (e){
    return res.status(400).json({ error: "Cannot Find Itineraries" });
  }
});

// itinerariesRouter.patch("/:id/", isAuthenticated, async (req, res, next) => {
//   const message = await Message.findByPk(req.params.id);
//   if (!message) {
//     return res
//       .status(404)
//       .json({ error: `Message(id=${req.params.id}) not found.` });
//   }
//   if (req.body.action === "upvote") {
//     await message.increment({ upvote: 1 });
//   } else if (req.body.action === "downvote") {
//     await message.increment({ downvote: 1 });
//   }
//   await message.reload();
//   return res.json(message);
// });

// itinerariesRouter.delete("/:id/", isAuthenticated, async (req, res, next) => {
//   const message = await Message.findByPk(req.params.id);
//   if (message) {
//     if (message.UserId !== req.session.userId) {
//       res
//         .status(403)
//         .json({ error: "You are not authorized to delete this message." });
//     } else {
//       await message.destroy();
//       return res.json(message);
//     }
//   } else {
//     return res
//       .status(404)
//       .json({ error: `Message(id=${req.params.id}) not found.` });
//   }
// });

