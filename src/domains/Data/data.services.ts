import fs from "fs";
import path from "path";

const getAllData = async () => {
  try {
    const filePath = path.join(__dirname, "data.txt");
    const readStream = fs.createReadStream(filePath, { encoding: "utf8" });
    return readStream;
  } catch (error) {
    console.error("Error reading file:", error);
    throw new Error("Can't load the data");
  }
};

const DataService = {
  getAllData,
};

export default DataService;
