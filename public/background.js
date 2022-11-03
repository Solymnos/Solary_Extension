/*global chrome*/

const CLIENT_ID = '7cfkyio9tmesj095ka74h05tcli9tw';
//const SCOPES = ['user:read:follows'];
//const OAUTH_BASE_URL = 'https://id.twitch.tv/oauth2';
const API_BASE_URL = 'https://api.twitch.tv/helix';
const SOLARY_STREAMERS_ID = [174955366, 103762288, 38284441, 140605154, 267811181, 39194732, 50977632, 103490313, 52616898, 113511896, 413138671, 198506129, 416031592, 21776474, 63675549, 78705692, 44784857, 412354630, 60408047, 107220879, 116205779, 60572036, 23264711, 107734513, 275937691];

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
    console.log(json.data.data.lenght);
    return(5);
}

const updateBadge = async () =>
{
    console.log('update badge');
    chrome.storage.sync.get(['token'], function(result)
    {
        console.log(result.token);
        if(result.token === undefined)
        {
            console.log('token is undefined');
            chrome.action.setBadgeText({text : '!'});
        } else {
            console.log('find a token');
            console.log(result.token);
            getStreamsOnlineCount(result.token).then((x) =>
            {
                console.log('receive ' + x.toString());
                chrome.action.setBadgeText({text : x.toString()});
            })
        }
    })
    
}

chrome.alarms.create({periodInMinutes: 0.25});
chrome.alarms.onAlarm.addListener(() => {
    updateBadge();
    //bc2a.postMessage('GET_NOTIFICATION');
})