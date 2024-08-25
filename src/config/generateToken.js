const jwt = require("jsonwebtoken");

// Generar token
const generateInitialToken = (companyId) => {
  const payload = {
    type: "initial_company_creation",
    companyId
  };
  const token = jwt.sign(payload, process.env.SECRET_JWT_KEY_ACCESS, {expiresIn: process.env.EXPIRATION_TOKEN});
  return token;
};

module.exports = generateInitialToken;