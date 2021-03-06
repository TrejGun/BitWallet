import express from "express";
import path from "path";
import createMetamascaraServer from "../server/";
import {createBundle, serveBundle} from "../server/util";
//
// Iframe Server
//

const mascaraServer = createMetamascaraServer();

// start the server
const mascaraPort = 9001;
mascaraServer.listen(mascaraPort);
console.log(`Mascara service listening on port ${mascaraPort}`);


//
// Dapp Server
//

const dappServer = express();

// serve dapp bundle
serveBundle(dappServer, "/app.js", createBundle(require.resolve("./app.js")));
dappServer.use(express.static(path.join(__dirname, "/app/")));

// start the server
const dappPort = "9002";
dappServer.listen(dappPort);
console.log(`Dapp listening on port ${dappPort}`);
