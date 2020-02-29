"use strict";

var base58 = require('bs58');

var assert = require('assert');

var hash = require('./hash');

module.exports = {
  checkDecode: checkDecode,
  checkEncode: checkEncode
};

function checkEncode(keyBuffer) {
  var keyType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  assert(Buffer.isBuffer(keyBuffer), 'expecting keyBuffer<Buffer>');

  if (keyType === 'sha256x2') {
    // legacy
    var checksum = hash.sha256(hash.sha256(keyBuffer)).slice(0, 4);
    return base58.encode(Buffer.concat([keyBuffer, checksum]));
  } else {
    var check = [keyBuffer];

    if (keyType) {
      check.push(Buffer.from(keyType));
    }

    var _checksum = hash.ripemd160(Buffer.concat(check)).slice(0, 4);

    return base58.encode(Buffer.concat([keyBuffer, _checksum]));
  }
}

function checkDecode(keyString) {
  var keyType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  assert(keyString != null, 'private key expected');
  var buffer = new Buffer(base58.decode(keyString));
  var checksum = buffer.slice(-4);
  var key = buffer.slice(0, -4);
  var newCheck;

  if (keyType === 'sha256x2') {
    // legacy
    newCheck = hash.sha256(hash.sha256(key)).slice(0, 4); // WIF (legacy)
  } else {
    var check = [key];

    if (keyType) {
      check.push(Buffer.from(keyType));
    }

    newCheck = hash.ripemd160(Buffer.concat(check)).slice(0, 4); //PVT
  }

  if (checksum.toString('hex') !== newCheck.toString('hex')) {
    throw new Error('Invalid checksum, ' + "".concat(checksum.toString('hex'), " != ").concat(newCheck.toString('hex')));
  }

  return key;
}