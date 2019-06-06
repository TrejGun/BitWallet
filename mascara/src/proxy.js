import SwController from "sw-controller";
import SwStream from "sw-stream/lib/sw-stream.js";
const createParentStream = require("iframe-stream").ParentStream;


const keepAliveDelay = Math.floor(Math.random() * (30000 - 1000)) + 1000;
const background = new SwController({
  fileName: "./scripts/background.js",
  keepAlive: true,
  keepAliveInterval: 30000,
  keepAliveDelay,
});

const pageStream = createParentStream();
background.on("ready", () => {
  const swStream = SwStream({
    serviceWorker: background.controller,
    context: "dapp",
  });
  pageStream.pipe(swStream).pipe(pageStream);

});
background.on("updatefound", () => window.location.reload());

background.on("error", console.error);
background.startWorker();
