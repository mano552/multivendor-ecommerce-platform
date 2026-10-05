const { Op } = require("sequelize");
const { Message, User, Product } = require("../models");

// POST /api/messages
const sendMessage = async (req, res) => {
  try {
    const { receiverId, productId, content } = req.body;
    const message = await Message.create({
      senderId: req.user.id,
      receiverId,
      productId,
      content,
    });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/messages/conversation/:otherUserId?productId=  -> full thread between two users
const getConversation = async (req, res) => {
  try {
    const otherUserId = req.params.otherUserId;
    const { productId } = req.query;

    const where = {
      [Op.or]: [
        { senderId: req.user.id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: req.user.id },
      ],
    };
    if (productId) where.productId = productId;

    const messages = await Message.findAll({
      where,
      include: [{ model: User, as: "sender", attributes: ["id", "fullName", "avatar"] }],
      order: [["createdAt", "ASC"]],
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/messages/threads -> list of distinct conversations for the logged-in user
const getThreads = async (req, res) => {
  const messages = await Message.findAll({
    where: { [Op.or]: [{ senderId: req.user.id }, { receiverId: req.user.id }] },
    include: [
      { model: User, as: "sender", attributes: ["id", "fullName", "avatar"] },
      { model: User, as: "receiver", attributes: ["id", "fullName", "avatar"] },
      { model: Product, as: "product", attributes: ["id", "name"] },
    ],
    order: [["createdAt", "DESC"]],
  });

  const threadsMap = new Map();
  messages.forEach((m) => {
    const other = m.senderId === req.user.id ? m.receiver : m.sender;
    const key = `${other.id}-${m.productId || "none"}`;
    if (!threadsMap.has(key)) {
      threadsMap.set(key, {
        otherUser: other,
        product: m.product,
        lastMessage: m.content,
        lastMessageAt: m.createdAt,
      });
    }
  });

  res.json(Array.from(threadsMap.values()));
};

// GET /api/messages/inbox
const getInbox = async (req, res) => {
  const messages = await Message.findAll({
    where: { receiverId: req.user.id },
    include: [
      { model: User, as: "sender", attributes: ["id", "fullName", "avatar"] },
      { model: Product, as: "product", attributes: ["id", "name"] },
    ],
    order: [["createdAt", "DESC"]],
  });
  res.json(messages);
};

module.exports = { sendMessage, getInbox, getConversation, getThreads };
