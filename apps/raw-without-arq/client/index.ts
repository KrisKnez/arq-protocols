import getOptions from "./getOptions";
// import oncePromise from "../../../shared/onceEvent";
import net from "net";
import { pEvent } from "p-event";

const options = await getOptions();

// const socket = net.connect({
//   host: options?.host,
//   port: options?.port,
// });

// socket.on("connect", async () => {
//   // We send a GET request
//   socket.write("GET / \r\n\r\n");

//   // We get the response
//   const data = (await pEvent(socket, "data")) as Buffer;

//   console.log(data.toString());

//   socket.end();
// });

import dgram from "dgram";
// const udpClient = dgram.createSocket('udp4');
import readline from "readline";
import {
  UDPStream,
  UDPStreamHandler,
  UDPStreamReference,
} from "../../../libs/udp-stream";
// const console = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// udpClient.connect(options["udp-port"], options["udp-host"], () => {
//   console.write("Opened connection\n")

//   console.on("line", (input) => udpClient.send(input))

//   udpClient.on('message', (msg) => {
//     console.write(msg.toString())
//   })
// })

const arqServer = dgram.createSocket("udp4");
const arqStreamHandler = new UDPStreamHandler(arqServer);
arqStreamHandler.on("connection", (streamReference: UDPStreamReference) => {
  const { stream: arqStream } = streamReference;

  const udpClient = dgram.createSocket("udp4");
  // udpClient.on("message", (msg) => console.log("udpClient.on.message", msg.toString()))
  udpClient.connect(options["udp-port"], options["udp-host"], () => {
    const udpStream = new UDPStream(udpClient, {
      port: options["udp-port"],
      address: options["udp-host"],
    });

    // udpStream.on("data", (chunk) => console.log("udpStream.on.data", chunk))

    arqStream.pipe(udpStream).pipe(arqStream);
  });
});

arqServer.bind(options["arq-port"], options["arq-host"], () => {
  console.log(
    "Started ARQ server on",
    `${options["arq-host"]}:${options["arq-port"]}`
  );
  console.log(
    "Forwarding via UDP to",
    `${options["udp-host"]}:${options["udp-port"]}`
  );
});