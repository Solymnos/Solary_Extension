import React from 'react';
import { getToken } from '../utils/twitchUtils';

const LoggingTwitch = () =>{
    return (
        <div className='loggingTwitch' onClick={() => getToken()}>
            <h1 className='idTwitch'>S'identifier à Twitch</h1>
            <img className='logoTwitch' src='Logo_Twitch.png' alt="logo de twitch"></img>
        </div>
    )
}

export default LoggingTwitch;
