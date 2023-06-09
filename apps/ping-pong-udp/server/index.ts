import dgram from "dgram"

const server = dgram.createSocket("udp4")

server.on("message", (msg: Buffer, rinfo: dgram.RemoteInfo) => {
    console.log(`recv ${rinfo.address}:${rinfo.port}:`, msg.toString())

    if (msg.toString() === "ping") {
        server.send("pong", rinfo.port, rinfo.address)
        console.log(`send ${rinfo.address}:${rinfo.port}:`, "pong")
    }
    else {
        server.send(msg, rinfo.port, rinfo.address)
        console.log(`send ${rinfo.address}:${rinfo.port}:`, msg.toString())
    }
})

server.bind(4000)