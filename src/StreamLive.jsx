import React from 'react';

const StreamLive = ({ stream, pp }) => {
    return (
        <a href={"https://twitch.tv/" + stream.user_login} target="_blank" rel="noopener noreferrer" className='linkToChannel'>
            <div className='streamLive'>

                <div className='pp'>
                    <img className='profilePic' src={pp} alt='pp'/>
                </div>
                <div className='infos'>
                    <p className='username'>{stream.user_name}</p>
                    <p className='titre'>{stream.title}</p>
                </div>
            </div>
        </a>
    )
}

export default StreamLive;