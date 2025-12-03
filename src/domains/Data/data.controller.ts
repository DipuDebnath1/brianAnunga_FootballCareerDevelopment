import { Response } from "express";
import dataService from "./data.services";
import { handleError } from "../../lib/errorsHandle";
import httpStatus, { status } from "http-status";
import { ProtectedRequest } from "../../types/protected-request";
import redis from "../../config/redis";

const getAllData = async (req: ProtectedRequest, res: Response) => {
  try {
    res.setHeader("Content-Type", "application/json");
    res.status(httpStatus.OK);
    const cacheBigData = await redis.get("big-data");

    if (cacheBigData) {
      console.log(`Serving data from Cache...`);
      const response = {
        code: httpStatus.OK,
        status: "OK",
        message: "Serving Data from Cache",
        data: JSON.parse(cacheBigData),
      };
      res.json(response);
    } else {
      console.log("Fetching data from data service...");
      const readStream = await dataService.getAllData();
      const chunks: string[] = [];
      readStream.on("data", (chunk) => {
        const base64Chunk = chunk.toString("base64"); // Encode each chunk in base64
        chunks.push(base64Chunk); // Collect all chunks
      });

      readStream.on("end", async () => {
        const allData = chunks.join(""); // Combine all base64 chunks into a single string

        // Step 4: Cache the data in Redis
        await redis.set("big-data", JSON.stringify(allData), "EX", 3600); // Cache for 1 hour (3600 seconds)

        // Step 5: Return the data to the client
        const responseData = {
          code: 200,
          status: "OK",
          message: "Streaming data",
          data: allData, // Send the combined base64 data
        };

        res.json(responseData); // Send the JSON response
      });
    }
  } catch (error) {
    const handledError = handleError(error); // Handle any other errors
    res.status(500).json({ error: handledError.message });
  }
};

const dataController = {
  getAllData,
};

export default dataController;
