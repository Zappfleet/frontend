import { useEffect, useRef } from 'react';
import { io } from "socket.io-client";

export default function useSocket(props: any = {}) {

    const ref = useRef<any>();

    useEffect(() => {
        const socket = io(`${import.meta.env.VITE_BASE_URL}`, {
            reconnectionDelayMax: 10000,
            autoConnect: true,
            path: import.meta.env.VITE_SOCKET_PATH,
            auth: {
                token: localStorage.getItem("bearer_token")
            },
        });
        ref.current = socket;
        Object.entries(props.listeners).map(([event, listener]: any) => {
            socket.on(event, listener);
        })
        return () => {
            Object.entries(props.listeners).map(([event, listener]: any) => {
                socket.off(event, listener);
            })
        }
    }, []);
    return ref;
}