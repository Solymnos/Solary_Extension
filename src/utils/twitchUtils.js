/*global chrome*/
import axios from "axios";

const secretId = process.env.REACT_APP_API_KEY;
const clientId = '7cfkyio9tmesj095ka74h05tcli9tw';
const streamsID = [174955366, 103762288, 38284441, 140605154, 267811181, 39194732, 50977632, 103490313, 52616898, 113511896, 413138671, 198506129, 416031592, 21776474, 63675549, 78705692, 44784857, 412354630, 60408047, 107220879, 116205779, 60572036, 23264711, 107734513, 275937691];

var listProfilesPics;

export const CLIENT_ID = '7cfkyio9tmesj095ka74h05tcli9tw';

export const RESPONSE_TYPE_TOKEN = 'token';

export const SCOPES = ['user:read:follows'];

export const OAUTH_BASE_URL = 'https://id.twitch.tv/oauth2';

export const API_BASE_URL = 'https://api.twitch.tv/helix';

const promptVerify = false;

const getAuthURL = () => {
    let redirectUrl = chrome.identity.getRedirectURL('extension');
    if (redirectUrl.slice(-1) === '/') {
        redirectUrl = redirectUrl.slice(0, -1);
    }
    console.log(redirectUrl);
    let ui = `${OAUTH_BASE_URL}/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUrl}&response_type=${RESPONSE_TYPE_TOKEN}&force_verify=${promptVerify}&scope=${SCOPES.join(
        '%20',
    )}`;
    console.log(ui);
    return ui;
};

export const getToken2 = async() => 
{
    chrome.identity.launchWebAuthFlow({
        url : getAuthURL(),
        interactive : true
    }, function(redirectURL) 
        {
            console.log(redirectURL);
            const url = new URL(redirectURL);
            const queryParams = new URLSearchParams(url.hash.substring(1));
            const token = queryParams.get('access_token');
            console.log('token = ' + token);
        });
}

export const getToken = async() =>
{
    let response  = await axios({
        method: "post",
        url : `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${secretId}&grant_type=client_credentials`,
    })
    return response.data.access_token;
}

const buildLivesInfosUrl = () =>
{
    let url = `https://api.twitch.tv/helix/streams`;
    for (const [i, streamID] of streamsID.entries())
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

export const getLivesInfos = async(token) =>
{
    let url = buildLivesInfosUrl();
    let response = await axios({
        method : 'get',
        url : url,
        headers: { 'Authorization' : `Bearer ${token}`, 'Client-Id' : clientId }
    });
    return(response.data.data);
}

const buildStreamersInfosUrl = (data) =>
{
    let url = `https://api.twitch.tv/helix/users`; 
    console.log(data);
    data.forEach(function (stream, i) {
        if (i === 0)
        {
            url += '?';
            url += `id=${stream.user_id}`
        } else {
            url += '&';
            url += `id=${stream.user_id}`;
        }
    })
    return url;
}

export const getStreamersInfos = async(token, data) =>
{
    listProfilesPics = [];

    console.log(data);
    let url = buildStreamersInfosUrl(data);
    let response = await axios({
        method : 'get',
        url : url,
        headers: { 'Authorization' : `Bearer ${token}`, 'Client-Id' : clientId }
    });
    console.log(response.data.data);
    response.data.data.forEach(function(stream) {
        listProfilesPics.push({ id : stream.id, profilePic : stream.profile_image_url });
    })
    return true;
}

export const getStreamerProfilePic = (stream) =>
{
    const streamerData = listProfilesPics.find(element => element.id === stream.user_id);
    return streamerData.profilePic;
}