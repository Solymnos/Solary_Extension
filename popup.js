//const userID = '7cfkyio9tmesj095ka74h05tcli9tw';
const url = 'https://api.twitch.tv/helix/streams'
const usersID = [174955366, 103762288, 38284441, 140605154, 267811181, 39194732, 50977632, 103490313,52616898, 113511896];
const info = document.getElementById('info');
const secretId = 'ot1b7gq6gyjk4blohl83qnbcfoigoy';
const clientId = '7cfkyio9tmesj095ka74h05tcli9tw';
const liveStream = [];
const titre = document.getElementById('titre');
const liste = document.getElementById('liste');

const cb = function ()
{
    if (liveStream.length == 0)
    {
        titre.innerHTML = 'Pas de streamers Solary en live :(';
    } else {
        titre.innerHTML = 'Nombre de streamers Solary en live : ' + liveStream.length;
    }
    console.log('en live : ');
    console.log(liveStream);
}

async function getLive(cb)
{
    let token = await getToken();
    let headers = {
        'Authorization' : `Bearer ${token}`,
        'Client-Id': clientId,
    };
    for (const userID of usersID)
    {
        let response = await fetch(`https://api.twitch.tv/helix/streams?user_id=${userID}`, { headers : headers });
        let json = await response.json();
        if (json.data.length != 0)
        {
            liveStream.push(json);
        }
    }
    cb();
}

async function getToken()
{
    let response = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${secretId}&grant_type=client_credentials`, {method: 'POST'});
    let json = await response.json();
    let token = json.access_token;
    return token;
}

getLive(cb);