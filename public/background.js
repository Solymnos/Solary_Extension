/*global chrome*/

const CLIENT_ID = '7cfkyio9tmesj095ka74h05tcli9tw';
//const SCOPES = ['user:read:follows'];
//const OAUTH_BASE_URL = 'https://id.twitch.tv/oauth2';
const API_BASE_URL = 'https://api.twitch.tv/helix';
const SOLARY_STREAMERS_ID = [174955366, 103762288, 38284441, 140605154, 267811181, 39194732, 50977632, 103490313, 52616898, 113511896, 413138671, 198506129, 416031592, 21776474, 63675549, 78705692, 44784857, 412354630, 60408047, 107220879, 116205779, 60572036, 23264711, 107734513, 275937691];

var streamersThatWasOnline = [];

const getLivesInfos = async(token) =>
{
    let url = buildLivesInfosUrl();
    let response = await fetch(url, 
        {
            method: 'get',
            headers : new Headers({
                'Authorization' :  `Bearer ${token}`,
                'Client-Id' : CLIENT_ID,
            }),
        });
    let json = await response.json();
    return(json.data);
}

const extractID = (listStreams) =>
{
    var listID = [];
    
    for (const stream of listStreams)
    {
        listID.push(stream.user_id);
    }
    return listID;
}

const getInfoStreamer = async (ID, token) =>
{
    let url = `${API_BASE_URL}/users?id=${ID}`;
    let response = await fetch(url, 
        {
            method: 'get',
            headers : new Headers({
                'Authorization' :  `Bearer ${token}`,
                'Client-Id' : CLIENT_ID,
            }),
        });
    let json = await response.json();
    return json.data;
}

const getInfoStream = async (ID, token) =>
{
    let url = `${API_BASE_URL}/streams?user_id=${ID}`;
    let response = await fetch(url, 
        {
            method: 'get',
            headers : new Headers({
                'Authorization' :  `Bearer ${token}`,
                'Client-Id' : CLIENT_ID,
            }),
        });
    let json = await response.json();
    return json.data;
}

const getNotifications = () =>
{
    console.log('try get notif');
    chrome.storage.sync.get(['notification'], function(result)
    {
        if (result.notification === 'up')
        {
            chrome.storage.sync.get(['token'], async function(result)
            {
                console.log("try get list stream with " +result.token);
                let listActiveStream = await getLivesInfos(result.token);
                let listActiveID = extractID(listActiveStream);
                let newStreamersID = [];
                if (streamersThatWasOnline.length === 0)
                {
                    console.log('no streamers')
                    streamersThatWasOnline = listActiveID;
                } else {
                    console.log(streamersThatWasOnline);
                    for (const streamerID of listActiveID)
                    {
                        const found = streamersThatWasOnline.find(element => element === streamerID);
                        if (found === undefined)
                        {
                            newStreamersID.push(streamerID);
                        }
                    }
                    streamersThatWasOnline = listActiveID;
                    for (const newStreamerID of newStreamersID)
                    {
                        const infoStreamer = await getInfoStreamer(newStreamerID, result.token);
                        const infoStream = await getInfoStream(newStreamerID, result.token);
                        chrome.notifications.create('NewLive', {
                            title: infoStreamer[0].display_name + ' joue à ' + infoStream[0].game_name,
                            iconUrl : infoStreamer[0].profile_image_url,
                            message : infoStream[0].title,
                            type : 'basic'
                        });
                    }
                }
            });
        } else {
            console.log('notification are down' + result.notification)
        }
    })
}

const buildLivesInfosUrl = () =>
{
    let url = `${API_BASE_URL}/streams`;
    for (const [i, streamID] of SOLARY_STREAMERS_ID.entries())
    {
        if (i === 0)
        {
            url += '?';
            url += `user_id=${streamID}`;
        } else {
            url += '&';
            url += `user_id=${streamID}`;
        }
    }
    return url;
}

const getStreamsOnlineCount = async(token) =>
{
    let url = buildLivesInfosUrl();
    let response = await fetch(url, 
        {
            method: 'get',
            headers : new Headers({
                'Authorization' :  `Bearer ${token}`,
                'Client-Id' : CLIENT_ID,
            }),
        });
    let json = await response.json();
    return(json.data.length);
}

const updateBadge = async () =>
{
    chrome.storage.sync.get(['token'], async function(result)
    {
        if(result.token === undefined)
        {
            chrome.action.setBadgeText({text : '!'});
        } else {
            var x = await getStreamsOnlineCount(result.token);
            chrome.action.setBadgeText({text : x.toString()});
        }
    })
    
}

chrome.alarms.create({periodInMinutes: 0.25});
chrome.alarms.onAlarm.addListener(() => {
    updateBadge();
    getNotifications();
})

// TODO : VERIFICATION WITH A BAD TOKEN AND ADD REFRESH TOKEN, NOTIFICATION