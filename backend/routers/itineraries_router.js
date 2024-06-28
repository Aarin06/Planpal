import { Router } from "express";
// import db from "../firebase.js";

export const itinerariesRouter = Router();

const ITINERARIES_COLLECTION = "itineraries";

itinerariesRouter.post("/", async (req, res) => {
  // console.log(req.body)
  // if (!req.body) {
  //   return res.status(400).json({ error: "Request is missing a body" });
  // }
  // const { title, users } = req.body;
  // try {
  //   const docRef = await db.collection('itineraries').add({title, users});
  //   console.log(docRef);
  //   return res.json({ id: docRef.id });
  // } catch (error) {
  //   return res.status(500).json({ error: error.message });
  // }
  // const { name, status } = req.body
  // console.log(name, status)
  // const peopleRef = db.collection('people').doc('associates')
  // console.log(peopleRef)
  // res.json({pll: "ok"})

  // Data to be added
  const docData = {
    name: 'John Doe',
    age: 30,
    email: 'johndoe@example.com'
  };

  // Add a new document with a generated ID to 'users' collection
  const addDoc = async () => {
    try {
      const res = await db.collection('users').add(docData);
      console.log('Document written with ID: ', res.id);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  }
  addDoc();
});
