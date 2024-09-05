const multer = require("multer");
const path = require("path");

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../public/uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre de archivo
  }
});

// Filtro para archivos
const fileFilter = (_, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb("Error: Tipo de archivo no permitido");
};

// Inicializar multer con la configuración de almacenamiento y filtro
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 8 }, // Limite de 8 MB
  fileFilter
});

module.exports = upload;