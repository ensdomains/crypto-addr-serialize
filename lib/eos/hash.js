import { SHA3 } from 'sha3';
import Ripemd160 from 'noble-ripemd160';

export function sha256(data, resultEncoding) {
  return new SHA3(256).update(data).digest(resultEncoding);
}

export function ripemd160(data) {
  return Buffer.from(Ripemd160(new Uint8Array(data)));
}
