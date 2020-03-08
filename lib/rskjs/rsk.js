import { Keccak } from 'sha3';

export const stripHexPrefix = (str) => {
    return str.slice(0, 2) === '0x' ? str.slice(2) : str
};
export const toChecksumAddress = (address, chainId = null) => {
    if (typeof address !== 'string') {
        throw new Error("stripHexPrefix param must be type 'string', is currently type " + (typeof address) + ".");
    }
    const strip_address = stripHexPrefix(address).toLowerCase()
    const prefix = chainId != null ? (chainId.toString() + '0x') : ''
    const keccak_hash = keccak(prefix + strip_address).toString('hex')
    let output = '0x'

    for (let i = 0; i < strip_address.length; i++)
        output += parseInt(keccak_hash[i], 16) >= 8 ?
            strip_address[i].toUpperCase() :
            strip_address[i];
    return output
};
export function isValidChecksumAddress(address, chainId) {
    return isValidAddress(address) && (toChecksumAddress(address, chainId) === address)
}
function isValidAddress(address) {
    return /^0x[0-9a-fA-F]{40}$/.test(address)
}
function keccak(a) {
    return new Keccak(256).update(a).digest()
}
