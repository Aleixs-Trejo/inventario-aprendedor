const fs = require("node:fs")
const multer = require("multer");
const path = require("node:path");

// Verificar si el directorio de archivos existe, si no existe crearlo
const uploadDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre de archivo
  }
});

// Filtro para archivos
const fileFilter = (req, file, cb) => {
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
  limits: { fileSize: 1024 * 1024 * 2 }, // Limite de 2 MB
  fileFilter
});

module.exports = upload;