const multer = require("multer");
const path = require("path");

// Configuración de almacenamiento de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../public/uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Aquí se asigna el nombre del archivo
  }
});

// Filtro para aceptar solo ciertos archivos
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
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