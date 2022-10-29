import { useEffect, useState } from 'react';
import './App.css';
import StreamLive from './StreamLive';

const secretId = 'ot1b7gq6gyjk4blohl83qnbcfoigoy';
const clientId = '7cfkyio9tmesj095ka74h05tcli9tw';
const streamsID = [174955366, 103762288, 38284441, 140605154, 267811181, 39194732, 50977632, 103490313, 52616898, 113511896, 413138671, 198506129, 416031592];
let token;

const App = () => {
    const [ streamsOnLine, setStreamsOnline ] = useState([]);
    const [ listProfilePics, setListProfilesPics ] = useState([]);
    const [ isReady, setIsReady ] = useState(false);

    const getToken = async() => 
    {
        let response = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${secretId}&grant_type=client_credentials`, {method: 'POST'});
        let data = await response.json();
        return(data.access_token);
    }
    
    const loadProfilePictures = async(data) =>
    {
        const listPP = [];

        let url = `https://api.twitch.tv/helix/users`;
        
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
        let response = await fetch(url, { headers : {'Authorization' : `Bearer ${token}`, 'Client-Id' : clientId }});
        let dataJSON = await response.json();
        dataJSON.data.forEach(function(stream) {
            listPP.push({id : stream.id, pp : stream.profile_image_url});
        })
        setListProfilesPics(listPP);
        setIsReady(true);
    }

    const getPP = (stream) =>
    {
        console.log(listProfilePics);
        const userData = listProfilePics.find(element => element.id == stream.user_id)
        console.log(userData)
        console.log(userData.pp)
        return userData.pp;
    }

    const getStreamsOnline = async() =>
    {
        let url = `https://api.twitch.tv/helix/streams`;
        token = await getToken();

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
        let response = await fetch(url, { headers : {'Authorization' : `Bearer ${token}`, 'Client-Id' : clientId}});
        let data = await response.json();
        console.log(data.data);
        setStreamsOnline(data.data);
        loadProfilePictures(data.data);
    }

    useEffect(() => {
        getStreamsOnline();
    }, []);

    if (isReady == false)
    {
        return null;
    }

    return (
        <div className='app'>
            { 
                streamsOnLine.length > 0
                ? ( <div className='container'>
                    {streamsOnLine.map((stream) =>(
                        <StreamLive stream={stream} pp={getPP(stream)}/>
                    ))}
                    </div>
                ) : (
                    <div className='empty'>
                        <h2 className='empty'>Personne ne live actuellement 💔</h2>
                    </div>
                )
            }
        </div>
    )
}

export default App;