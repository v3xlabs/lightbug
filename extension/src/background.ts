/**
 * Limitations:
 *  - navigator.serial is not usable in the background
 */

chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
});
