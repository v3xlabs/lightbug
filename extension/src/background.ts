/**
 * Limitations:
 *  - navigator.serial is not usable in the background
 */

chrome.runtime.onInstalled.addListener(async () => {
    console.log("Extension installed", isSecureContext, navigator.permissions);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Background got message', request);
    if (request.action === 'openPopup') {
        console.log('openPopup called');
        // @ts-ignore
        // console.log(chrome);
        chrome.action.openPopup();
    }
});
