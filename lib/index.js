'use strict';

const { b32decode, b32encode, hex2a, ua2hex } = require('./nem-sdk/convert');
const { codec } = require('./ripple/xrp-codec');
const { isValidChecksumAddress, stripHexPrefix, toChecksumAddress } = require('./rskjs/rsk');
const eosPublicKey = require('./eos/key_public');
const { encodeCheck, decodeCheck, calculateChecksum } = require('./str/publicKey');
const { ss58Encode, ss58Decode } = require('./ss58');

module.exports = {
    b32decode,
    b32encode,
    hex2a,
    ua2hex,
    isValidChecksumAddress,
    stripHexPrefix,
    toChecksumAddress,
    codec,
    eosPublicKey,
    encodeCheck,
    decodeCheck,
    calculateChecksum,
    ss58Encode,
    ss58Decode,
};
