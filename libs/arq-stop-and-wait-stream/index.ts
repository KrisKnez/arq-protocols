import { Duplex, Stream } from "stream";

class StopAndWaitStream extends Duplex {
  sequence_number: number;
  buffer: Buffer;

  constructor() {
    super();

    this.sequence_number = 0;
  }

  _read(size: number): void {
    // Receive packet
    // console.log(size);
  }

  _write(
    chunk: any,
    encoding: BufferEncoding,
    callback: (error?: Error | null | undefined) => void
  ): void {
    // Send packet

    setTimeout(() => {
      this.push(chunk, encoding);
      callback();
    }, 200);
  }
}

class Logger extends Duplex {
    _read(size: number): void {
        
    }
    _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null | undefined) => void): void {
        console.log("Log:", chunk.toString())
        this.push(chunk, encoding)
        callback()
    }
}

const channel = new Logger()

const streamA = new StopAndWaitStream();

const streamB = new StopAndWaitStream();

process.stdin.pipe(streamA).pipe(channel).pipe(streamB).pipe(channel).pipe(streamA)

