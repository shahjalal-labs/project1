import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 3000 * 1024 * 1024 }, // 3000 MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "video/mp4",
      "video/x-matroska",
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("File type not allowed") as unknown as null, false);
    }
    cb(null, true);
  },
});

// upload single image
const profileImage = upload.single("profileImage");
const coverPhoto = upload.single("coverPhoto");

// upload multiple image
const uploadMultiple = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "classVideo", maxCount: 1 },
]);

export const fileUploader = {
  upload,
  uploadMultiple,
  profileImage,
  coverPhoto,
};
