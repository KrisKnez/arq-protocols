import { Duplex } from "stream";

export class LatencyStream extends Duplex {
  constructor() {
    super();
  }

  _read() {}

  _write(chunk, encoding, callback) {
    setTimeout(() => {
      this.push(chunk, encoding);
      callback();
    }, 500);
  }
}
