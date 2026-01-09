import multer from "multer";

// 1. Define the storage engine
const storage = multer.memoryStorage();

// 2. Pass the storage engine into the multer instance
const upload = multer({
  storage: storage, // This links the memory storage to the middleware
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

export default upload;
