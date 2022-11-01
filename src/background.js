async function setIcon()
{
    console.log('1');
    const x = 1;
    chrome.action.setBadgeText({text: x.toString()});
}

chrome.alarms.create({periodInMinutes: 1});
chrome.alarms.onAlarm.addListener(() => {
    setIcon();
})