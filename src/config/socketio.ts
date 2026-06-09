import { Server as SocketIOServer } from "socket.io";
import { Server } from "http";
import logger from "../lib/logger";

const setUpSocketIO = (server: Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    logger.info("A new user connected to socket");

    socket.on("message", (data) => {
      logger.info(`Message from client: ${JSON.stringify(data)}`);
      io.emit("message", { text: "Hello from the server!" });
    });

    socket.on("disconnect", () => {
      logger.info("A user disconnected from socket");
    });

    socket.on("joinRoom", (room) => {
      socket.join(room);
      logger.info(`User joined room: ${room}`);
    });

    socket.on("sendToRoom", (room, message) => {
      socket.to(room).emit("message", { text: message });
    });
  });

  return io;
};

export default setUpSocketIO;
