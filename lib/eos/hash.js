"use strict";

var { SHA3 } = require('sha3');
var RIPEMD160 = require('ripemd160-min');

function sha256(data, resultEncoding) {
  return new SHA3(256).update(data).digest(resultEncoding);
}

function ripemd160(data) {
  return new RIPEMD160().update(data).digest()
}
module.exports = {
  sha256: sha256,
  ripemd160: ripemd160 // hash160: hash160,
};