const mongoose = require("mongoose");

const {MONGODB_URL} = process.env;

const MONGODB_URI = `${MONGODB_URL}`;

mongoose.connect(`${MONGODB_URI}`)
  .then(console.log(`Base de datos conectada`))
  .catch(err => console.log(err));