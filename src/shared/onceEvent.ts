import { EventEmitter } from "events";

interface EventEmitter {
  on(event: string, callback: (...args: any[]) => void): void;
  once(event: string, callback: (...args: any[]) => void): void;
}

interface EventEmitterObject {
  [key: string]: EventEmitter;
}

function oncePromise(emitters: EventEmitterObject, eventName: string): Promise<any> {
  return new Promise((resolve) => {
    emitters[eventName].once(eventName, (returnValue: any) => {
      resolve(returnValue);
    });
  });
}


export default oncePromise;
