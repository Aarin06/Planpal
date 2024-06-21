import { Message } from "../models/messages.js";
import { Router } from "express";
import { isAuthenticated } from "../middleware/helpers.js";

export const messagesRouter = Router();

messagesRouter.post("/", isAuthenticated, async (req, res, next) => {
  if (!req.body.content) {
    return res.status(400).json({ error: "Message content is required." });
  }
  const message = await Message.create({
    content: req.body.content,
    UserId: req.session.userId,
  });
  return res.json(message);
});

messagesRouter.get("/", async (req, res, next) => {
  const messages = await Message.findAll({
    limit: 5,
    include: { association: "User", attributes: ["username"] },
  });
  return res.json({ messages });
});

messagesRouter.patch("/:id/", isAuthenticated, async (req, res, next) => {
  const message = await Message.findByPk(req.params.id);
  if (!message) {
    return res
      .status(404)
      .json({ error: `Message(id=${req.params.id}) not found.` });
  }
  if (req.body.action === "upvote") {
    await message.increment({ upvote: 1 });
  } else if (req.body.action === "downvote") {
    await message.increment({ downvote: 1 });
  }
  await message.reload();
  return res.json(message);
});

messagesRouter.delete("/:id/", isAuthenticated, async (req, res, next) => {
  const message = await Message.findByPk(req.params.id);
  if (message) {
    if (message.UserId !== req.session.userId) {
      res
        .status(403)
        .json({ error: "You are not authorized to delete this message." });
    } else {
      await message.destroy();
      return res.json(message);
    }
  } else {
    return res
      .status(404)
      .json({ error: `Message(id=${req.params.id}) not found.` });
  }
});
