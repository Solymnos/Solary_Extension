/* global chrome*/

export function getStorageValuePromise(key) {
    return new Promise((resolve) => {
        chrome.storage.sync.get(key, resolve);
    });
}