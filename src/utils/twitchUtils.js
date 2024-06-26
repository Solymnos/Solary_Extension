/*global chrome*/
import axios from 'axios';
import { CLIENT_ID, SCOPES, OAUTH_BASE_URL, API_BASE_URL, SOLARY_STREAMERS_ID } from '../config';
import { v4 } from 'uuid';
import { store } from '../app/store';
import { updateStatus } from '../feature/statusSlice';
import { getStorageValuePromise } from './chromeStorageUtils';

var listProfilesPics;
var wasInLive = [];

const getAuthURL = (securityPassword) => {
    let redirectUrl = chrome.identity.getRedirectURL('extension');
    if (redirectUrl.slice(-1) === '/') {
        redirectUrl = redirectUrl.slice(0, -1);
    }
    let url = `${OAUTH_BASE_URL}/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUrl}&response_type=token&force_verify=false}&state=${securityPassword}&scope=${SCOPES.join('%20',)}`;
    return url;
};

export const getToken = async() => 
{
    const securityPassword = v4();

    chrome.identity.launchWebAuthFlow({
        url : getAuthURL(securityPassword),
        interactive : true
    }, function(redirectURL) 
        {
            console.log(redirectURL);
            const url = new URL(redirectURL);
            const queryParams = new URLSearchParams(url.hash.substring(1));
            const token = queryParams.get('access_token');
            const state = queryParams.get('state');
            console.log(token);
            if (!token || state !== securityPassword)
            {
                console.log('ERROR WITH TOKEN');
            } else {
                chrome.storage.sync.set({token: token});
                store.dispatch(updateStatus('LOG_ON_TWITCH'));
                console.log(store.getState((state) => state.status.status))
                if (chrome.storage.sync.get(['notification'], function(result)
                {
                    if (result.notification === undefined)
                    {
                        chrome.storage.sync.set({notification : 'up'});
                    }
                }));
            }
        });
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

export const getLivesInfos = async() =>
{
    //var token;
    //chrome.storage.sync.get(['token'], token);
    var promise = await getStorageValuePromise('token');
    var token = promise.token;
    console.log(token);
    console.log('try get lives infos with token ' + token);
    let url = buildLivesInfosUrl();
    let response = await axios({
        method : 'get',
        url : url,
        headers: { 'Authorization' : `Bearer ${token}`, 'Client-Id' : CLIENT_ID }
    });
    return(response.data.data);
}

const buildStreamersInfosUrl = (data) =>
{
    let url = `${API_BASE_URL}/users`; 
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

export const getStreamersInfos = async(data) =>
{
    listProfilesPics = [];

    var promise = await getStorageValuePromise('token');
    var token = promise.token;
    console.log(token);
    let url = buildStreamersInfosUrl(data);
    let response = await axios({
        method : 'get',
        url : url,
        headers: { 'Authorization' : `Bearer ${token}`, 'Client-Id' : CLIENT_ID }
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

export const getNotificationFromStreamers = async() =>
{
    var promise = await getStorageValuePromise('token');
    var token = promise.token;
    console.log(token);
    let url = buildLivesInfosUrl();
    var actualInLive = [];
    var newInLive = [];
    let response = await axios({
        method : 'get',
        url : url,
        headers: { 'Authorization' : `Bearer ${token}`, 'Client-Id' : CLIENT_ID }
    });
    response.data.data.forEach(function(stream) {
        const found = wasInLive.find(element => element === stream.id);
        if (found === null)
        {
            newInLive += stream.id;
        }
        actualInLive += stream.id;
    })
    wasInLive = actualInLive;
    return(newInLive);
}