import { getCurveByName, Point } from './ecc';
import { checkEncode, checkDecode } from './key_utils';

const secp256k1 = getCurveByName('secp256k1');

export default function PublicKey(Q) {
  const pubkey_prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'EOS';

  if (typeof Q === 'string') {
    return PublicKey.fromString(Q, pubkey_prefix);
  } else if (Buffer.isBuffer(Q)) {
    return PublicKey.fromBuffer(Q);
  } else if (typeof Q === 'object' && Q.Q) {
    return PublicKey(Q.Q);
  }

  function toBuffer() {
    const compressed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Q.compressed;
    return Q.getEncoded(compressed);
  }

  function toString() {
    const pubkey_prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'EOS';
    return pubkey_prefix + checkEncode(toBuffer());
  }

  function toHex() {
    return toBuffer().toString('hex');
  }

  return {
    Q,
    toString,
    toBuffer,
    toHex
  };
}

PublicKey.isValid = function (pubkey) {
  const pubkey_prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'EOS';

  try {
    PublicKey(pubkey, pubkey_prefix);
    return true;
  } catch (e) {
    return false;
  }
};

PublicKey.fromBuffer = function (buffer) {
  return PublicKey(Point.decodeFrom(secp256k1, buffer));
};

PublicKey.fromString = function (public_key) {
  const pubkey_prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'EOS';

  try {
    return PublicKey.fromStringOrThrow(public_key, pubkey_prefix);
  } catch (e) {
    return null;
  }
};

PublicKey.fromStringOrThrow = function (public_key) {
  const pubkey_prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'EOS';
  const match = public_key.match(/^PUB_([A-Za-z0-9]+)_([A-Za-z0-9]+)$/);

  if (match === null) {
    // legacy
    const prefix_match = new RegExp("^" + pubkey_prefix);

    if (prefix_match.test(public_key)) {
      public_key = public_key.substring(pubkey_prefix.length);
    }

    return PublicKey.fromBuffer(checkDecode(public_key));
  }

  const [, keyType, keyString] = match;

  return PublicKey.fromBuffer(checkDecode(keyString, keyType));
};

PublicKey.fromHex = function (hex) {
  return PublicKey.fromBuffer(new Buffer(hex, 'hex'));
};

PublicKey.fromStringHex = function (hex) {
  return PublicKey.fromString(new Buffer(hex, 'hex'));
};
