<<<<<<< HEAD
require("dotenv").config();
const express = require("express");
const app = express();
=======
require('dotenv').config()
const express = require('express')
const app = express()
>>>>>>> 1b252cf5b790b84d34e5fcc15a132a5c868ead73

const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");
const { errorHandler } = require("./middlewares");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(routes);
app.use(errorHandler);

mongoose
  .connect(process.env.MONGODB_ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    // * Send logs
    console.log("mongoose connected into AWS MongoDB Atlas Main Cluster");

    // * Listen the app
    const PORT = +process.env.PORT;
    app.listen(PORT, () => {
      console.log("Server is live at http://localhost:" + PORT);
    });
  })
  .catch(console.error);

module.exports = app;
