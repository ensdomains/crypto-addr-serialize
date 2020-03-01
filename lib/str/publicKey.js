var _isString = require('lodash/isString');
var _base = require('base32.js');
var _base2 = _interopRequireDefault(_base);
var { crc16xmodem } = require('./crc16xmodem');
var _isNull = require('lodash/isNull');
var _isNull2 = _interopRequireDefault(_isNull);
var _isString2 = _interopRequireDefault(_isString);
var _isUndefined = require('lodash/isUndefined');
var _isUndefined2 = _interopRequireDefault(_isUndefined);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }


var versionBytes = {
    ed25519PublicKey: 6 << 3, // G
    ed25519SecretSeed: 18 << 3, // S
    preAuthTx: 19 << 3, // T
    sha256Hash: 23 << 3 // X
};

const decodeCheck = (versionByteName, encoded) => {
    if (!(0, _isString2.default)(encoded)) {
        throw new TypeError('encoded argument must be of type String');
    }

    var decoded = _base2.default.decode(encoded);
    var versionByte = decoded[0];
    var payload = decoded.slice(0, -2);
    var data = payload.slice(1);
    var checksum = decoded.slice(-2);
    var _isUndefined = require('lodash/isUndefined');
    var _isUndefined2 = _interopRequireDefault(_isUndefined);

    if (encoded !== _base2.default.encode(decoded)) {
        throw new Error('invalid encoded string');
    }

    var expectedVersion = versionBytes[versionByteName];

    if ((0, _isUndefined2.default)(expectedVersion)) {
        throw new Error(versionByteName + ' is not a valid version byte name.  expected one of "accountId" or "seed"');
    }

    if (versionByte !== expectedVersion) {
        throw new Error('invalid version byte. expected ' + expectedVersion + ', got ' + versionByte);
    }

    var expectedChecksum = calculateChecksum(payload);

    if (!(0, verifyChecksum)(expectedChecksum, checksum)) {
        throw new Error('invalid checksum');
    }

    return Buffer.from(data);
};

const encodeCheck = (versionByteName, data) => {
    if ((0, _isNull2.default)(data) || (0, _isUndefined2.default)(data)) {
        throw new Error('cannot encode null data');
    }

    var versionByte = versionBytes[versionByteName];

    if ((0, _isUndefined2.default)(versionByte)) {
        throw new Error(versionByteName + ' is not a valid version byte name.  expected one of "ed25519PublicKey", "ed25519SecretSeed", "preAuthTx", "sha256Hash"');
    }

    data = Buffer.from(data);
    var versionBuffer = Buffer.from([versionByte]);
    var payload = Buffer.concat([versionBuffer, data]);
    var checksum = calculateChecksum(payload);
    var unencoded = Buffer.concat([payload, checksum]);

    return _base2.default.encode(unencoded);
}

const calculateChecksum = (payload) => {
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

module.exports = { calculateChecksum, decodeCheck, encodeCheck };