import React, { useEffect, useState, useRef } from 'react';
import useSocket from '../useSocket';
import { PASSENGER_NOTIF } from '../../lib/constants';
import { NotificationController } from '../../lib/notificationController';
import { io } from "socket.io-client";

const GetPassengerNotification = () => {
    const [result, setResult] = useState(null);

    const handleFunction = (payload: any) => {
        console.log(4555);

        try {
            console.log(7888);
            
            NotificationController.showSuccess(payload.notif.message)
        } catch (error) {
            console.error('Error in handleFunction:', error);
        }
    };

    const socket = useSocket({
        listeners: {
            [PASSENGER_NOTIF]: handleFunction,
        },
    });

    useEffect(() => {
      //  console.log(74);
        const socketInstance = io(
            import.meta.env.VITE_ENVIRONMENT_NAME==='local'?
            import.meta.env.VITE_BASE_URL:
            import.meta.env.VITE_BASE_URL_SERVER 
            , {
            reconnectionDelayMax: 10000,
            autoConnect: true,
            path: '/api/v2/socket',
            auth: {
                token: localStorage.getItem('bearer_token'),
            },
        });

        if (!socket.current) return;
        socketInstance.on(PASSENGER_NOTIF, (response: any) => {
            console.log('jdjlshfdkjgfghg:', response);
            handleFunction(response);
        });
        socket.current.on(PASSENGER_NOTIF, handleFunction);

        return () => {
            if (socket.current) {
                socket.current.off(PASSENGER_NOTIF, handleFunction);
            }
        };
    }, [socket]);

    return null;
};

export default GetPassengerNotification;
