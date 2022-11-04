/* global chrome*/
import React from 'react';
import { store } from '../app/store'
import { changeNotificationStatus } from '../feature/statusSlice';


const changeNotification = () =>
{
    const notificationStatus = store.getState((state) => state.status.notification);
    console.log(notificationStatus.status.notification);
    if (notificationStatus.status.notification === true)
    {
        store.dispatch(changeNotificationStatus(false));
        chrome.storage.sync.set({notification : 'down'});
    } else {
        store.dispatch(changeNotificationStatus(true));
        chrome.storage.sync.set({notification : 'up'});
    }
}

const Header = (props) => {
    var imgNotif;
    if (props.srcNotif === true)
    {
        imgNotif = 'notification.png';
    } else {
        imgNotif = 'no_notification.png';
    }

    return (
        <div className= 'header'>
            <img className='headerLogo' src='Logo_Solary_White.png' alt='Logo Solary Blanc'></img>
            <img className='headerText' src='Logo_Solary_Text.png' alt='logo Textuel Solary'></img>
            <img onClick={() => changeNotification()} className='headerNotification' src={imgNotif} alt=' cloche pour notification'></img>
        </div>
    )
}

export default Header;