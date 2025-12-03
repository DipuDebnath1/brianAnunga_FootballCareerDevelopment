import express, { Request, Response } from "express";
import routes from "./routes/index";
import logRequestResponse from "./middlewares/logger.middleware";
import compression from "compression";
const app = express();

app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// compression the all data
app.use(compression());

// Use the logging middleware for all routes
app.use(logRequestResponse);
// Use the centralized routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Node and Express!");
});
app.use("/api/v1", routes); // This mounts all the routes under the /api prefix (e.g., /api/user)fgh

export default app;
