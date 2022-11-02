const bc1a = new BroadcastChannel('UPDATE_BADGE');
const bc1b = new BroadcastChannel('ANSWER_BADGE');
const bc2a = new BroadcastChannel('UPDATE_NOTIFICATION');
const bc2b = new BroadcastChannel('ANSWER_NOTIFICATION');

bc1b.onmessage = (event) =>
{
    chrome.action.setBadgeText({text: event.data});
}

bc2b.onmessage = (event) =>
{
    chrome.notifications.create('Nouveau Live !', {

    })
}

chrome.alarms.create({periodInMinutes: 0.25});
chrome.alarms.onAlarm.addListener(() => {
    bc1a.postMessage('GET_NB_STREAMER');
    //bc2a.postMessage('GET_NOTIFICATION');
})