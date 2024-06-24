import { useState, useEffect, useRef } from 'react';
import useSocket from '../useSocket';
import useFleet from '../data/useFleet';
import { EVENT_FLEET_GPS_REQUEST, EVENT_FLEET_GPS_UPDATE } from '../../lib/constants';
import { io } from "socket.io-client";

const useFleetGps = (permitForRunUseFleetGps: boolean,vehicleIDs: any, mapRef: any, icon: any, scale: any) => {
    const [fleetGps, setFleetGps] = useState<any>(null);
    const fleetData: any = useFleet();
    const intervalRef = useRef<any>(null);
    const fakeLocationIntervalRef = useRef<any>(null);
    const markersRef = useRef<any>({});

    console.log('start use flee',mapRef);
    
    const fleetGpsUpdate = (payload: any) => {
        try {
            if (!fleetData?.data?.vehicles?.docs) return;

            const newFleetGps: any = {};
            fleetData.data.vehicles.docs.forEach((vehicle: any) => {
                newFleetGps[vehicle._id] = {
                    vehicle_gps: payload[vehicle._id],
                    user_gps: vehicle?.driver_user && payload[vehicle.driver_user._id],
                };
            });
            setFleetGps(newFleetGps);
        } catch (error) {
            console.error("Error in fleetGpsUpdate:", error);
        }
    };

    const socket = useSocket({
        listeners: {
            [EVENT_FLEET_GPS_UPDATE]: fleetGpsUpdate,
        },
    });

    useEffect(() => {
        if (!permitForRunUseFleetGps) return;

        if (fleetGps) {
            vehicleIDs?.forEach((vehicleID: any) => {
                const owner_id = vehicleID;
                const vehicleGps = fleetGps[owner_id]?.vehicle_gps;

                if (markersRef.current[owner_id]) {
                    mapRef.current?.remove(markersRef.current[owner_id].marker);
                    delete markersRef.current[owner_id];
                }

                if (vehicleGps) {
                    const [lng, lat] = vehicleGps.coordinates;
                    const marker = mapRef.current?.addMarker(lat, lng, true, icon, scale);
                    markersRef.current[owner_id] = marker;
                } else {
                    console.log("No GPS data found for owner_id:", owner_id);
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
    }, [permitForRunUseFleetGps, socket,fleetData]);

    useEffect(() => {
        if (permitForRunUseFleetGps && socket.current) {
            intervalRef.current = setInterval(() => {
                try {
                    socket.current.emit(EVENT_FLEET_GPS_REQUEST);
                } catch (error) {
                    console.error("Error emitting EVENT_FLEET_GPS_REQUEST:", error);
                }
            }, 5000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [permitForRunUseFleetGps, socket]);

    useEffect(() => {
        if (permitForRunUseFleetGps) {
            fakeLocationIntervalRef.current = setInterval(() => {
                try {
                    sendFakeLocations();
                } catch (error) {
                    console.error("Error in sendFakeLocations:", error);
                }
            }, 10000);
        }

        return () => {
            if (fakeLocationIntervalRef.current) {
                clearInterval(fakeLocationIntervalRef.current);
                fakeLocationIntervalRef.current = null;
            }
        };
    }, [permitForRunUseFleetGps]);

    return fleetGps;
};

export default useFleetGps;

// Generate fake Data
function getRandomLocation(min: any, max: any) {
    return (Math.random() * (max - min) + min).toFixed(6);
}

function getRandomBearing() {
    return (Math.random() * 360).toFixed(2);
}

const startLat = 52.81879283605966; // Example starting latitude
const startLng = 29.89099803112387; // Example starting longitude
const endLat = 52.808064; // Example ending latitude
const endLng = 29.88258900000001; // Example ending longitude

function sendFakeLocations() {
    try {
        const socket = io(`http://localhost:4000`, {
            reconnectionDelayMax: 10000,
            autoConnect: true,
            path: import.meta.env.VITE_SOCKET_PATH,
            auth: {
                token: localStorage.getItem("bearer_token")
            },
        });

        socket.on('connect', () => {
            let locations = [];
            for (let i = 0; i < 2; i++) {
                const lat = getRandomLocation(startLat, endLat);
                const lng = getRandomLocation(startLng, endLng);
                const bearing = getRandomBearing();
                locations.push({ lat, lng, bearing });
            }

            const EVENT_GPS_UPDATE = 'event-gps-update';
            socket.emit(EVENT_GPS_UPDATE, JSON.stringify(locations)); // Ensure payload is a JSON string
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });
    } catch (error) {
        console.error("Error in sendFakeLocations:", error);
    }
}
