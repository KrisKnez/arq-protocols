import { Duplex } from "stream";

type ARQPacket = {
  sequenceNumber: number;
  data: string;
};

export const encodeARQPacket = (packet: ARQPacket) => {
  const sequenceNumberBuffer = Buffer.alloc(4);
  sequenceNumberBuffer.writeInt32BE(packet.sequenceNumber);

  const dataBuffer = Buffer.from(packet.data);

  return Buffer.concat([sequenceNumberBuffer, dataBuffer]);
};

export const decodeARQPacket = (encodedPacket: Buffer): ARQPacket => {
  const sequenceNumber = encodedPacket.readInt32BE(0);

  const dataBuffer = encodedPacket.slice(4);

  const packet = {
    sequenceNumber,
    data: dataBuffer.toString(),
  };

  return packet;
};
