/**
 * Limitations:
 *  - navigator.serial is not usable in the background
 */

chrome.runtime.onInstalled.addListener(async () => {
    console.log("Extension installed", isSecureContext, navigator.permissions);
});
