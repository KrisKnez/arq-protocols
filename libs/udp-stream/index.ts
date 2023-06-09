import { Duplex } from "stream";
import { EventEmitter } from "events";
import dgram from "dgram";

export type UDPStreamRemoteInfo = Required<
  Pick<dgram.RemoteInfo, "port" | "address">
> &
  Partial<Omit<dgram.RemoteInfo, "port" | "address">>;

export class UDPStream extends Duplex {
  server: dgram.Socket;
  rinfo: UDPStreamRemoteInfo;

  constructor(socket: dgram.Socket, rinfo: UDPStreamRemoteInfo) {
    super();

    this.server = socket;
    this.rinfo = rinfo;

    socket.on("message", (msg: Buffer, rinfo: dgram.RemoteInfo) => {
      if (
        rinfo.address === this.rinfo.address &&
        rinfo.port === this.rinfo.port
      ) {
        this.push(msg);
      }
    });
  }

  _read() {}

  _write(chunk, encoding, callback) {
    // console.log(
    //   `send ${this.rinfo.address}:${this.rinfo.port}:`,
    //   Buffer.from(chunk, encoding).toString()
    // );
    this.server.send(
      Buffer.from(chunk, encoding),
      this.rinfo.port,
      this.rinfo.address
    );
    callback();
  }
}

export type UDPStreamKey = string;
export interface UDPStreamReference {
  address: string;
  port: number;
  stream: UDPStream;
  timeout: NodeJS.Timeout;
}

interface IUDPStreamHandler {
  on(event: "connection", stream: (stream: UDPStreamReference) => void): this;
}

export class UDPStreamHandler
  extends EventEmitter
  implements IUDPStreamHandler
{
  server: dgram.Socket;
  connections: Map<string, UDPStreamReference>;
  timeoutDuration: number;

  closeStream(key: UDPStreamKey) {
    const connection = this.connections.get(key);
    if (connection) {
      clearTimeout(connection.timeout);
      this.connections.delete(key);
      // console.log(`timeout ${connection.address}:${connection.port}`);
    }
  }

  generateTimeout(key: UDPStreamKey) {
    return setTimeout(() => {
      this.closeStream(key);
    }, this.timeoutDuration);
  }

  refreshStream(key: UDPStreamKey) {
    const connection = this.connections.get(key);
    if (connection) {
      clearTimeout(connection.timeout);
      connection.timeout = this.generateTimeout(key);
    }
  }

  generateKey(rinfo: dgram.RemoteInfo): UDPStreamKey {
    return `${rinfo.address}:${rinfo.port}`;
  }

  createStream(rinfo: dgram.RemoteInfo) {
    const key = this.generateKey(rinfo);

    if (!this.connections.has(key)) {
      const connectionWithoutStream: Omit<UDPStreamReference, "stream"> = {
        address: rinfo.address,
        port: rinfo.port,
        timeout: this.generateTimeout(key),
      };

      const stream: UDPStreamReference = {
        ...connectionWithoutStream,
        stream: new UDPStream(this.server, rinfo),
      };

      this.connections.set(key, stream);

      this.emit("connection", stream);

      return stream;
    }
  }

  constructor(socket: dgram.Socket, timeoutDuration: number = 60_000) {
    super();

    this.server = socket;
    this.connections = new Map();
    this.timeoutDuration = timeoutDuration;

    this.server.on("message", (msg: Buffer, rinfo: dgram.RemoteInfo) => {
      // console.log(`recv ${rinfo.address}:${rinfo.port}:`, msg.toString());

      const key = this.generateKey(rinfo);

      if (this.connections.has(key)) this.refreshStream(key);
      else {
        const stream = this.createStream(rinfo);
        stream?.stream.push(msg);
      }
    });
  }
}
