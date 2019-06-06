import path from "path";
import express from "express";
import compression from "compression";


export default function createMetamascaraServer () {

  // setup server
  const server = express();
  server.use(compression());

  // serve assets
  server.use(express.static(path.join(__dirname, "/../ui/"), {setHeaders: (res) => res.set("X-Frame-Options", "DENY") }));
  server.use(express.static(path.join(__dirname, "/../../dist/mascara")));
  server.use(express.static(path.join(__dirname, "/../proxy")));

  return server;

}
