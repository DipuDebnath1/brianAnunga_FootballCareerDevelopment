import http from "http";
import connectionToDb from "./config/db";
import config from "./config/index";
import setUpSocketIO from "./config/socketio";
import logger from "./lib/logger";
import app from "./server";

connectionToDb();

const server = http.createServer(app);
setUpSocketIO(server);

server.listen(config.port, config.ip, () => {
  logger.info(`Server is running at http://${config.ip}:${config.port}`);
});
