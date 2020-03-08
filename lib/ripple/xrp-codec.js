import baseCodec from 'base-x';
import Sha256 from 'sha.js/sha256';
import { seqEqual, concatArgs } from './utils';

class Codec {
    constructor(options) {
        this.sha256 = options.sha256;
        this.alphabet = options.alphabet;
        this.codec = baseCodec(this.alphabet);
        this.base = this.alphabet.length;
    }
    encodeChecked(buffer) {
        const check = this.sha256(this.sha256(buffer)).slice(0, 4);
        return this.encodeRaw(Buffer.from(concatArgs(buffer, check)));
    }
    encodeRaw(bytes) {
        return this.codec.encode(bytes);
    }
    decodeChecked(base58string) {
        const buffer = this.decodeRaw(base58string);
        if (buffer.length < 5) {
            throw new Error('invalid_input_size: decoded data must have length >= 5');
        }
        if (!this.verifyCheckSum(buffer)) {
            throw new Error('checksum_invalid');
        }
        return buffer.slice(0, -4);
    }
    decodeRaw(base58string) {
        return this.codec.decode(base58string);
    }
    verifyCheckSum(bytes) {
        const computed = this.sha256(this.sha256(bytes.slice(0, -4))).slice(0, 4);
        const checksum = bytes.slice(-4);
        return seqEqual(computed, checksum);
    }
}

const codecOptions = {
    sha256: function (bytes) {
        return new Sha256().update(Buffer.from(bytes)).digest();
    },
    alphabet: 'rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz'
};

export const codec = new Codec(codecOptions);
