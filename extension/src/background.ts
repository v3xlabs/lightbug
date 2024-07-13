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
        console.log('openPopup called', sender, request, sendResponse);

        // @ts-ignore
        // console.log(chrome);
        chrome.action.setBadgeText({ text: '1' })
        chrome.action.openPopup();
        setTimeout(() => {
            chrome.tabs.sendMessage(sender.tab?.id, { action: 'updatePopup', message: request.message });
        }, 1000);
    }

    if (request.action === 'requestInfo') {
        console.log('requestInfo called', sender, request, sendResponse);
        sendResponse({ action: 'updatePopup', payloda: 'txt' });
    }
});
