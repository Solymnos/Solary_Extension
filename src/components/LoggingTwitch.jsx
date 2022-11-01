import React from 'react';
import { getToken2 } from '../utils/twitchUtils';
const LoggingTwitch = ({}) =>{
    return (
        <div className='loggingTwitch' onClick={() => getToken2()}>
            <h1 className='idTwitch'>S'identifier à Twitch</h1>
            <img className='logoTwitch' src='Logo_Twitch.png' alt="image"></img>
        </div>
    )
}

export default LoggingTwitch;
