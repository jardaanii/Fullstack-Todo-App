const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");

const apiRoutes = require("./routes/index");
const { PORT } = require("./config/server-config");

const app = express();

const setupAndStartServer = async () => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/api", apiRoutes);
  app.use(morgan("combined"));

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};

setupAndStartServer();
