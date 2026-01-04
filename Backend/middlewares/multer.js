//  yaksko use chai  hamla image get garnalacham ni tahi vayara ho


import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: "ehat",
        resource_type: file.mimetype.startsWith("video") ? "video" : "image",
    }),
});


const upload = multer({ storage });

export default upload;






/*   Multer is a middleware for Express that handles multipart/form-data, which is required for file uploads (images, videos, PDFs, etc.)
Express cannot handle files by itself.  Multer teaches Express how to read files.

If you send an image from frontend:  formData.append("image", file) and backend has only app.use(express.json());  
then 
❌ req.body → empty

❌ req.file → undefined

❌ File is lost

because 
express.json() handles JSON, not files

Multer:
✔ Reads multipart/form-data
✔ Extracts files
✔ Makes them available as req.file or req.files


Client uploads file
   ↓
Multer intercepts request
   ↓
Reads binary file data
   ↓
Stores file (disk / memory / cloud)
   ↓
Adds file info to req.file / req.files
   ↓
Controller can access file
*/