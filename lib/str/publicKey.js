import { decode, encode } from 'base32.js';
import { crc16xmodem } from './crc16xmodem';

const isString = value => typeof value == 'string';
const isNull = value => value === null;
const isUndefined = value => value === undefined;

var versionBytes = {
    ed25519PublicKey: 6 << 3, // G
    ed25519SecretSeed: 18 << 3, // S
    preAuthTx: 19 << 3, // T
    sha256Hash: 23 << 3 // X
};

export const decodeCheck = (versionByteName, encoded) => {
    if (!isString(encoded)) {
        throw new TypeError('encoded argument must be of type String');
    }

    var decoded = decode(encoded);
    var versionByte = decoded[0];
    var payload = decoded.slice(0, -2);
    var data = payload.slice(1);
    var checksum = decoded.slice(-2);

    if (encoded !== encode(decoded)) {
        throw new Error('invalid encoded string');
    }

    var expectedVersion = versionBytes[versionByteName];

    if (isUndefined(expectedVersion)) {
        throw new Error(versionByteName + ' is not a valid version byte name.  expected one of "accountId" or "seed"');
    }

    if (versionByte !== expectedVersion) {
        throw new Error('invalid version byte. expected ' + expectedVersion + ', got ' + versionByte);
    }

    var expectedChecksum = calculateChecksum(payload);

    if (!verifyChecksum(expectedChecksum, checksum)) {
        throw new Error('invalid checksum');
    }

    return Buffer.from(data);
};

export const encodeCheck = (versionByteName, data) => {
    if (isNull(data) || isUndefined(data)) {
        throw new Error('cannot encode null data');
    }

    var versionByte = versionBytes[versionByteName];

    if (isUndefined(versionByte)) {
        throw new Error(versionByteName + ' is not a valid version byte name.  expected one of "ed25519PublicKey", "ed25519SecretSeed", "preAuthTx", "sha256Hash"');
    }

    data = Buffer.from(data);
    var versionBuffer = Buffer.from([versionByte]);
    var payload = Buffer.concat([versionBuffer, data]);
    var checksum = calculateChecksum(payload);
    var unencoded = Buffer.concat([payload, checksum]);

    return encode(unencoded);
}

export const calculateChecksum = (payload) => {
    // This code calculates CRC16-XModem checksum of payload
    // and returns it as Buffer in little-endian order.
    var checksum = Buffer.alloc(2);
    checksum.writeUInt16LE(crc16xmodem(payload), 0);
    return checksum;
};
const verifyChecksum = (expected, actual) => {
    if (expected.length !== actual.length) {
        return false;
    }

    if (expected.length === 0) {
        return true;
    }

    for (let i = 0; i < expected.length; i += 1) {
        if (expected[i] !== actual[i]) {
            return false;
        }
    }

    return true;
};
