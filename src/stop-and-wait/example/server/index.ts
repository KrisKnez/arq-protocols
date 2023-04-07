import getOptions from "./getOptions";

const options = await getOptions()

import net from "net"

const server = net.createServer()

server.on("connection", (socket) => {
  console.log(socket)
})

server.listen({
  host: options?.host,
  port: options?.port
})