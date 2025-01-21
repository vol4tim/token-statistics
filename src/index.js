import cors from "cors";
import express from "express";
import token from "./api/token/route";
import config from "./config";
import logger from "./utils/logger";
import createServer from "./utils/server";

const app = express();
const server = createServer(app);
app.use(cors());
app.use("/api/token", token);

server.listen(config.SERVER.PORT, config.SERVER.HOST, () => {
  logger.info(
    "Web listening " + config.SERVER.HOST + " on port " + config.SERVER.PORT,
  );
});
