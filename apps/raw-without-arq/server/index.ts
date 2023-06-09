import { Duplex } from "stream";
import {
  UDPStream,
  UDPStreamHandler,
  UDPStreamReference,
} from "../../../libs/udp-stream";
import getOptions from "./getOptions";
const options = await getOptions();

import dgram from "dgram";
import { LatencyStream } from "../../../libs/simulated-latency-stream";
const udpServer = dgram.createSocket("udp4");

const udpStreamHandler = new UDPStreamHandler(udpServer);

udpStreamHandler.on("connection", (streamReference: UDPStreamReference) => {
  const { stream: udpStream } = streamReference;

  console.log("New connection from", streamReference.address);

  const arqClient = dgram.createSocket("udp4");
  arqClient.connect(options["arq-port"], options["arq-host"], () => {
    const arqStream = new UDPStream(arqClient, {
      port: options["arq-port"],
      address: options["arq-host"],
    });

    // const latencyStream = new LatencyStream()

    // udpStream.pipe(arqStream).pipe(udpStream)

    udpStream.pipe(arqStream).pipe(udpStream);
  });
});

udpServer.bind(options["udp-port"], () => {
  console.log(
    "Started UDP server on",
    `${options["udp-host"]}:${options["udp-port"]}`
  );
  console.log(
    "Forwarding via ARQ to",
    `${options["arq-host"]}:${options["arq-port"]}`
  );
});
