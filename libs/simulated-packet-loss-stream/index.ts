import { Duplex } from "stream";

export class PacketLossStream extends Duplex {
  n: number;
  constructor() {
    super();

    this.n = 0;
  }

  _read() {}

  _write(chunk, encoding, callback) {
    this.n = this.n + 1;

    console.log(this.n);

    if (!(this.n % 20 === 0)) this.push(chunk, encoding);

    callback();
  }
}
