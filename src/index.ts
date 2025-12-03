import connectionToDb from "./config/db";
import setUpSocketIO from "./config/socketio";
import app from "./server";
import dotenv from "dotenv";
import http from "http";

// Loading the local Environment Variables from .env file
dotenv.config();

// connection to the database
connectionToDb();

// creating server
const server = http.createServer(app);

// initialize the socket io
const io = setUpSocketIO(server);

//using the post and ip over here
const backendIp = process.env.BACKEND_IP || "localhost";
const port = process.env.PORT || 3000;

server.listen(Number(port), backendIp, () => {
  console.log(`Server is running at http://${backendIp}:${port}`);
});
