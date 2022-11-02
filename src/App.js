import { useEffect, useState } from 'react';
import './App.css';
import { getLivesInfos, getStreamersInfos, getStreamerProfilePic } from './utils/twitchUtils';
import { useSelector } from 'react-redux';
import LoadingScreen from './components/LoadingScreen';
import LogginTwitch from './components/LoggingTwitch';
import StreamLive from './components/StreamLive';
import Header from './components/Header';

const App = () => 
{
    const [ streamsOnLine, setStreamsOnline ] = useState([]);
    const [ isReady, setIsReady ] = useState(false);
    const statusData = useSelector((state) => state.status.status);

    useEffect(() => 
    {
        const loadInfos = async() =>
        {
            if (statusData !== 'NOT_LOG_ON_TWITCH')
            {
                var token = localStorage.getItem('token');
                var streams = await getLivesInfos(token);
                setStreamsOnline(streams);
                await getStreamersInfos(token, streams);
                setIsReady(true);
            }
        }
        loadInfos();
    }, [statusData])

    if (statusData === 'NOT_LOG_ON_TWITCH')
    {
        return (
            <div className='app'>
                <Header />
                <LogginTwitch />
            </div>
        )
    }
    if (isReady === false)
    {
        return (
            <div className='app'>
                <Header />
                <LoadingScreen />
            </div>
        )
    }

    return (
        <div className='app'>
            <Header />
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