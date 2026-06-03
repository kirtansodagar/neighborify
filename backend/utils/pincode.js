import { PINCODE_DATA } from './pincodeData.js';

const PINCODE_REGEX = /^\d{6}$/;

export function isValidPincode(pincode) {
  return typeof pincode === 'string' && PINCODE_REGEX.test(pincode) && pincode !== '000000';
}

export function getPincodeInfo(pincode) {
  if (!isValidPincode(pincode)) return null;
  return PINCODE_DATA[pincode] || null;
}
