/*!
eosjs-ecc - Elliptic curve cryptography functions (ECC).

MIT License

Copyright (c) EOSIO

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var ecurve = require('./ecc');

var secp256k1 = ecurve.getCurveByName('secp256k1');

var getCurveByName  = require('./ecc/names');

var keyUtils = require('./key_utils');

module.exports = PublicKey;

function PublicKey(Q) {
  var pubkey_prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'EOS';

  if (typeof Q === 'string') {
    var publicKey = PublicKey.fromString(Q, pubkey_prefix);
    return publicKey;
  } else if (Buffer.isBuffer(Q)) {
    return PublicKey.fromBuffer(Q);
  } else if ((0, _typeof2["default"])(Q) === 'object' && Q.Q) {
    return PublicKey(Q.Q);
  }

  function toBuffer() {
    var compressed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Q.compressed;
    return Q.getEncoded(compressed);
  }

  function toString() {
    var pubkey_prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'EOS';
    return pubkey_prefix + keyUtils.checkEncode(toBuffer());
  }

  function toHex() {
    return toBuffer().toString('hex');
  }

  return {
    Q: Q,
    toString: toString,
    toBuffer: toBuffer,
    toHex: toHex
  };
}

PublicKey.isValid = function (pubkey) {
  var pubkey_prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'EOS';

  try {
    PublicKey(pubkey, pubkey_prefix);
    return true;
  } catch (e) {
    return false;
  }
};

PublicKey.fromBuffer = function (buffer) {
  return PublicKey(ecurve.Point.decodeFrom(secp256k1, buffer));
};

PublicKey.fromString = function (public_key) {
  var pubkey_prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'EOS';

  try {
    return PublicKey.fromStringOrThrow(public_key, pubkey_prefix);
  } catch (e) {
    return null;
  }
};

PublicKey.fromStringOrThrow = function (public_key) {
  var pubkey_prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'EOS';
  var match = public_key.match(/^PUB_([A-Za-z0-9]+)_([A-Za-z0-9]+)$/);

  if (match === null) {
    // legacy
    var prefix_match = new RegExp("^" + pubkey_prefix);

    if (prefix_match.test(public_key)) {
      public_key = public_key.substring(pubkey_prefix.length);
    }

    return PublicKey.fromBuffer(keyUtils.checkDecode(public_key));
  }

  var _match = (0, _slicedToArray2["default"])(match, 3),
      keyType = _match[1],
      keyString = _match[2];

  return PublicKey.fromBuffer(keyUtils.checkDecode(keyString, keyType));
};

PublicKey.fromHex = function (hex) {
  return PublicKey.fromBuffer(new Buffer(hex, 'hex'));
};

PublicKey.fromStringHex = function (hex) {
  return PublicKey.fromString(new Buffer(hex, 'hex'));
};