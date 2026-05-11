const socketIo = require("socket.io");

let io;

const init = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    socket.on("sendMessage", ({ to, from, message }) => {
      io.to(to).emit("message", { from, message, timestamp: new Date() });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

const sendNotification = (userId, notification) => {
  if (io) {
    io.to(userId).emit("notification", notification);
  }
};

module.exports = { init, getIo, sendNotification };
