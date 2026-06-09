import express, { Request, Response } from "express";
import routes from "./routes/index";
import logRequestResponse from "./middlewares/logger.middleware";
import compression from "compression";
import notFoundRoute from "./middlewares/notFoundRoute";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(logRequestResponse);

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello, TypeScript with Node and Express!");
});

app.use("/api/v1", routes);

app.use(notFoundRoute);
app.use(globalErrorHandler);

export default app;
