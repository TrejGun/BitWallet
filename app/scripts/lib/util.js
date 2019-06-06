import ethUtil from "ethereumjs-util";
import assert from "assert";
import BN from "bn.js";
import {
  ENVIRONMENT_TYPE_POPUP,
  ENVIRONMENT_TYPE_NOTIFICATION,
  ENVIRONMENT_TYPE_FULLSCREEN,
} from "./enums";


/**
 * Used to determine the window type through which the app is being viewed.
 *  - 'popup' refers to the extension opened through the browser app icon (in top right corner in chrome and firefox)
 *  - 'responsive' refers to the main browser window
 *  - 'notification' refers to the popup that appears in its own window when taking action outside of metamask
 *
 * @returns {string} A single word label that represents the type of window through which the app is being viewed
 *
 */
export function getEnvironmentType (url = window.location.href) {
  if (url.match(/popup.html(?:\?.+)*$/)) {
    return ENVIRONMENT_TYPE_POPUP;
  } else if (url.match(/home.html(?:\?.+)*$/) || url.match(/home.html(?:#.*)*$/)) {
    return ENVIRONMENT_TYPE_FULLSCREEN;
  } else {
    return ENVIRONMENT_TYPE_NOTIFICATION;
  }
}

/**
 * Converts a BN object to a hex string with a '0x' prefix
 *
 * @param {BN} inputBn The BN to convert to a hex string
 * @returns {string} A '0x' prefixed hex string
 *
 */
export function bnToHex (inputBn) {
  return ethUtil.addHexPrefix(inputBn.toString(16));
}

/**
 * Converts a hex string to a BN object
 *
 * @param {string} inputHex A number represented as a hex string
 * @returns {Object} A BN object
 *
 */
export function hexToBn (inputHex) {
  return new BN(ethUtil.stripHexPrefix(inputHex), 16);
}

/**
 * Used to multiply a BN by a fraction
 *
 * @param {BN} targetBN The number to multiply by a fraction
 * @param {number|string} numerator The numerator of the fraction multiplier
 * @param {number|string} denominator The denominator of the fraction multiplier
 * @returns {BN} The product of the multiplication
 *
 */
export function BnMultiplyByFraction (targetBN, numerator, denominator) {
  const numBN = new BN(numerator);
  const denomBN = new BN(denominator);
  return targetBN.mul(numBN).div(denomBN);
}
