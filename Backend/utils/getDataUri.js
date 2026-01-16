import DataUriParser from "datauri/parser.js";
import path from "path";

const parser = new DataUriParser();

const getDataUri = (file) => {
  if (!file || !file.buffer) {
    throw new Error("File buffer is missing");
  }

  const extName = path.extname(file.originalname).toString();
  const dataUri = parser.format(extName, file.buffer);
  return dataUri; 
};

export default getDataUri;
