"use strict";

var createHash = require('create-hash');

function sha256(data, resultEncoding) {
  return createHash('sha256').update(data).digest(resultEncoding);
}

function ripemd160(data) {
  try {
    return createHash('rmd160').update(data).digest();
  } catch (e) {
    return createHash('ripemd160').update(data).digest();
  }
}
module.exports = {
  sha256: sha256,
  ripemd160: ripemd160 // hash160: hash160,
};