import multer from "multer";
const storage = multer.memoryStorage();
const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const fileFilter = (req, file, cb) => {
    console.log(`📎 Multer fileFilter called for field="${file.fieldname}", filename="${file.originalname}", mimetype="${file.mimetype}"`);
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        console.warn(`❌ Multer rejected file: ${file.originalname} (mimetype: ${file.mimetype})`);
        cb(new Error("Only JPG, JPEG, PNG and WEBP image files are allowed."));
    }
};
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 5,
    },
});
export default upload;
