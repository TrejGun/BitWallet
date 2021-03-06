import extension from "extensionizer";
import promisify from "pify";
import {enabledLanguages} from "../../../ui/app/localization/constants";

const getPreferredLocales = extension.i18n ? promisify(
  extension.i18n.getAcceptLanguages,
  {errorFirst: false}
) : async () => [];

/**
 * Returns a preferred language code, based on settings within the user's browser. If we have no translations for the
 * users preferred locales, 'en' is returned.
 *
 * @returns {Promise<string>} Promises a locale code, either one from the user's preferred list that we have a translation for, or 'en'
 *
 */
export default async function getFirstPreferredLangCode () {
  let userPreferredLocaleCodes;

  try {
    userPreferredLocaleCodes = await getPreferredLocales();
  } catch (e) {
    // Brave currently throws when calling getAcceptLanguages, so this handles that.
    userPreferredLocaleCodes = [];
  }

  // safeguard for Brave Browser until they implement chrome.i18n.getAcceptLanguages
  // https://github.com/MetaMask/metamask-extension/issues/4270
  if (!userPreferredLocaleCodes) {
    userPreferredLocaleCodes = [];
  }

  const firstPreferredLangCode = userPreferredLocaleCodes
    .map(code => code.toLowerCase())
    .find(code => enabledLanguages.includes(code));
  return firstPreferredLangCode || "en";
}

