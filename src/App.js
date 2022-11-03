/* global chrome*/
import { useEffect, useState } from 'react';
import './App.css';
import { getLivesInfos, getStreamersInfos, getStreamerProfilePic, getStreamsOnlineCount, getNotificationFromStreamers } from './utils/twitchUtils';
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
    const notificationStatus = useSelector((state) => state.status.notification);

    const bc1a = new BroadcastChannel('UPDATE_BADGE');
    const bc1b = new BroadcastChannel('ANSWER_BADGE');
    const bc2a = new BroadcastChannel('UPDATE_NOTIFICATION');
    const bc2b = new BroadcastChannel('ANSWER_NOTIFICATION');

    bc1a.onmessage = (event) =>
    {
        console.log('on bc1a');
        if (localStorage.getItem('token') === null) 
        {
            bc1b.postMessage('!');
        } else {
            bc1b.postMessage(localStorage.getItem('token'));
            console.log('update badge');
            getStreamsOnlineCount().then((x) => {
                console.log('found ' + x.toString() + ' on live');
                bc1b.postMessage(x.toString());
                //chrome.action.setBadgeText({text: x.toString()});
            });
        }
    }

    bc2a.onmessage = (event) =>
    {
        if (localStorage.getItem('notification') === 'up')
        {
            const newStream = getNotificationFromStreamers();
            newStream.forEach((stream) => {
                bc2b.postMessage(stream);
            })
        }
    }

    useEffect(() => 
    {
        const loadInfos = async() =>
        {
            if (statusData !== 'NOT_LOG_ON_TWITCH')
            {
                var streams = await getLivesInfos();
                setStreamsOnline(streams);
                await getStreamersInfos(streams);
                setIsReady(true);
            }
        }
        loadInfos();
    }, [statusData])

    if (statusData === 'NOT_LOG_ON_TWITCH')
    {
        return (
            <div className='app'>
                <Header srcNotif={notificationStatus}/>
                <LogginTwitch />
            </div>
        )
    }
    if (isReady === false)
    {
        return (
            <div className='app'>
                <Header srcNotif={notificationStatus}/>
                <LoadingScreen />
            </div>
        )
    }

    return (
        <div className='app'>
            <Header srcNotif={notificationStatus}/>
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