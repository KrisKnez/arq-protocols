import getOptions from "./getOptions";
// import oncePromise from "../../../shared/onceEvent";
import net from "net";
import { pEvent } from "p-event";

const options = await getOptions();

const socket = net.connect({
  host: options?.host,
  port: options?.port,
});

socket.on("connect", async () => {
  // We send a GET request
  socket.write("GET / \r\n\r\n");

  // We get the response
  const data = (await pEvent(socket, "data")) as Buffer;

  console.log(data.toString());

  socket.end();
});
