import readline from "readline"
const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

import dgram from "dgram"
const client = dgram.createSocket("udp4")

readlineInterface.on("line", (input) => {
    client.send(input, 2000, "127.0.0.1")
    console.log(`send ${"127.0.0.1"}:${2000}:`, input)
})

client.on("message", (msg: Buffer, rinfo: dgram.RemoteInfo) => {
    console.log(`recv ${rinfo.address}:${rinfo.port}:`, msg.toString())
})

// client.bind(2000)