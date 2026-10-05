const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { Message, User, Product } = require("./models");

let io = null;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL || "*" },
  });

  // Authenticate every socket connection using the same JWT used for the REST API.
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("No auth token provided"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    // Each user has a private room, so we can push messages to them from anywhere.
    socket.join(`user:${socket.userId}`);

    socket.on("send_message", async ({ receiverId, productId, content }, callback) => {
      try {
        if (!content || !content.trim()) return;
        const message = await Message.create({
          senderId: socket.userId,
          receiverId,
          productId: productId || null,
          content: content.trim(),
        });

        const full = await Message.findByPk(message.id, {
          include: [
            { model: User, as: "sender", attributes: ["id", "fullName", "avatar"] },
            { model: Product, as: "product", attributes: ["id", "name"] },
          ],
        });

        // Push to both participants so all open tabs/devices stay in sync.
        io.to(`user:${receiverId}`).emit("new_message", full);
        io.to(`user:${socket.userId}`).emit("new_message", full);

        if (callback) callback({ ok: true, message: full });
      } catch (err) {
        if (callback) callback({ ok: false, error: err.message });
      }
    });

    socket.on("typing", ({ receiverId }) => {
      io.to(`user:${receiverId}`).emit("typing", { fromUserId: socket.userId });
    });
  });

  return io;
};

const getIO = () => io;

module.exports = { initSocket, getIO };
