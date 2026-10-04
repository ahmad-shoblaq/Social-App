import { config } from "dotenv";
import express from "express";
import { bootstrap } from "./app.controller";
import { getIo, ioInitializer } from "./socket-io";

config();

const app = express();
const port = 3000;
bootstrap(app,express)

const server = app.listen(port,()=>{
    console.log("Server is running on ",port);
});

ioInitializer(server);