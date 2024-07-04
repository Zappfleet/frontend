import { useState, useEffect, useRef } from 'react';
import useSocket from '../useSocket';
import useFleet from '../data/useFleet';
import { EVENT_FLEET_GPS_REQUEST, EVENT_FLEET_GPS_UPDATE } from '../../lib/constants';
import { io } from "socket.io-client";
import useAuthentication from '../data/useAuthentication';
import useVehicles from '../data/useVehicles';

const getCurrentLocations = (permitForRunUseFleetGps: boolean, vehicleIDs: any, mapRef: any, icon: any, scale: any) => {
    const { authInfo } = useAuthentication();
    const { vehicles } = useVehicles();
    const [fleetGps, setFleetGps] = useState<any>(null);
   // const fleetData: any = useFleet();
    const markersRef = useRef<any>({});
    const LocationIntervalRef = useRef<any>(null);

    console.log('start use flee', mapRef);

    const fleetGpsUpdate = (payload: any) => {
      //  console.log(85856,payload);
        try {
            setFleetGps(payload);
        } catch (error) {
            console.error('Error in fleetGpsUpdate:', error);
        }
    };

    const socket = useSocket({
        listeners: {
            [EVENT_FLEET_GPS_UPDATE]: fleetGpsUpdate,
        },
    });

    const getLocationFromServer = (ownerID: any) => {
        try {
            const socketInstance = io(`http://localhost:4000`, {
                reconnectionDelayMax: 10000,
                autoConnect: true,
                path: import.meta.env.VITE_SOCKET_PATH,
                auth: {
                    token: localStorage.getItem('bearer_token'),
                },
            });

            socketInstance.on('connect', () => {
                let payload: any = {};
                payload.ownerID = ownerID;
                socketInstance.emit(EVENT_FLEET_GPS_REQUEST, JSON.stringify(payload));
            });

            socketInstance.on(EVENT_FLEET_GPS_UPDATE, (response: any) => {
                console.log('Received GPS response:', response);
                fleetGpsUpdate(response);
            });

            socketInstance.on('disconnect', () => {
                console.log('Disconnected from server');
            });
        } catch (error) {
            console.error('Error in getLocationFromServer:', error);
        }
    };

    useEffect(() => {
        if (!permitForRunUseFleetGps) return;
        if (fleetGps) {
            fleetGps?.map((item: any) => {
                const owner_id = item.owner_id;
               
                if (markersRef.current[owner_id]) {
                    mapRef.current?.remove(markersRef.current[owner_id].marker);
                    delete markersRef.current[owner_id];
                }

                if (item?.coordinates && item.coordinates.length===2) {
                    const [lng, lat] = item.coordinates;
                 //   console.log(111,lng,lat);
                    
                    const marker = mapRef.current?.addMarker(lng, lat, true, icon, scale);
                    markersRef.current[owner_id] = marker;
                } else {
                    console.log('No GPS data found for owner_id:', owner_id);
                }
            });
        }
    }, [fleetGps, mapRef, icon, scale]);

    useEffect(() => {
        if (!permitForRunUseFleetGps || !socket.current) return;

        socket.current.on(EVENT_FLEET_GPS_UPDATE, fleetGpsUpdate);

        return () => {
            if (socket.current) {
                socket.current.off(EVENT_FLEET_GPS_UPDATE, fleetGpsUpdate);
            }
        };
    }, [permitForRunUseFleetGps, socket]);

    useEffect(() => {
        if (permitForRunUseFleetGps) {
            LocationIntervalRef.current = setInterval(() => {
                try {
                    getLocationFromServer(vehicleIDs);
                } catch (error) {
                    console.error('Error in getLocationFromServer:', error);
                }
            }, 15000);
        } else {
            if (LocationIntervalRef.current) {
                clearInterval(LocationIntervalRef.current);
                LocationIntervalRef.current = null;
            }
        }

        return () => {
            if (LocationIntervalRef.current) {
                clearInterval(LocationIntervalRef.current);
                LocationIntervalRef.current = null;
            }
        };
    }, [permitForRunUseFleetGps, vehicleIDs]);

    return fleetGps;
};

export default getCurrentLocations;
