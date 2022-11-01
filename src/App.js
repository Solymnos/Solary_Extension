//https://youtu.be/O87hWNxiQ5w?t=870
import { useEffect, useState } from 'react';
import './App.css';
import StreamLive from './components/StreamLive';
import { getToken, getLivesInfos, getStreamersInfos, getStreamerProfilePic } from './utils/twitchUtils';
import LogginTwitch from './components/LoggingTwitch';

const App = () => 
{
    const [ streamsOnLine, setStreamsOnline ] = useState([]);
    const [ isReady, setIsReady ] = useState(false);
    const [ isLog, setIsLog ] = useState(false);

    useEffect(() => 
    {
        const loadInfos = async() =>
        {
            var token = await getToken();
            var streams = await getLivesInfos(token);
            setStreamsOnline(streams);
            await getStreamersInfos(token, streams);
            setIsReady(true);
        }
        loadInfos();
    }, [])

    if (isLog === false)
    {
        return (
            <div className='app'>
                <LogginTwitch />
            </div>
        )
    }
    if (isReady === false)
    {
        return null;
    }

    return (
        <div className='app'>
            { 
                streamsOnLine.length > 0
                ? ( <div className='container'>
                    {streamsOnLine.map((stream) =>(
                        <StreamLive stream={stream} pp={getStreamerProfilePic(stream)}/>
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