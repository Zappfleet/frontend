import React, { useState, useEffect, useRef } from 'react';
import { io } from "socket.io-client";

function SendCurrentLocations({ vehicleID }: any) {
    const [position, setPosition] = useState<any>({ latitude: null, longitude: null });
    const LocationIntervalRef = useRef<any>(null);


    const sendCurrentLocationToServer = (vehicleIDs: any) => {

        const target = {//تهران
            latitude: 35.6892,
            longitude: 51.3890
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                   // console.log(252365);

                    const { latitude, longitude } = position.coords;
                    //  const bearing = calculateBearing(latitude, longitude, target.latitude, target.longitude);
                   // console.log(401, latitude, longitude, vehicleIDs);
                    sendLocationToServer(latitude, longitude, null, vehicleID);
                },
                (error) => {
                    console.error("Error getting location: ", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }

    const calculateBearing = (lat1: any, lon1: any, lat2: any, lon2: any) => {
        const toRadians = (degrees: any) => degrees * (Math.PI / 180);
        const toDegrees = (radians: any) => radians * (180 / Math.PI);

        const dLon = toRadians(lon2 - lon1);
        const y = Math.sin(dLon) * Math.cos(toRadians(lat2));
        const x = Math.cos(toRadians(lat1)) * Math.sin(toRadians(lat2)) -
            Math.sin(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.cos(dLon);
        const brng = toDegrees(Math.atan2(y, x));
        return (brng + 360) % 360; // نرمال‌سازی به 0-360
    };

    function sendLocationToServer(lat: any, lng: any, bearing: any, ownerID: any) {
        try {
            const socket = io(import.meta.env.VITE_BASE_URL, {
                reconnectionDelayMax: 10000,
                autoConnect: true,
                path: import.meta.env.VITE_SOCKET_PATH,
                auth: {
                    token: localStorage.getItem("bearer_token")
                },
            });

            socket.on('connect', () => {
                let locations = [];
                locations.push({ lat, lng, ownerID });


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

    useEffect(() => {
        LocationIntervalRef.current = setInterval(() => {
            try {
                sendCurrentLocationToServer([vehicleID]);
            } catch (error) {
                console.error("Error in sendCurrentLocationToServer:", error);
            }
        }, 15000);

        return () => {
            if (LocationIntervalRef.current) {
                clearInterval(LocationIntervalRef.current);
                LocationIntervalRef.current = null;
            }
        };
    }, []);

    return null
}

export default SendCurrentLocations;




// // Generate fake Data
// function getRandomLocation(min: any, max: any) {
//     return (Math.random() * (max - min) + min).toFixed(6);
// }

// function getRandomBearing() {
//     return (Math.random() * 360).toFixed(2);
// }

// const startLat = 52.81879283605966; // Example starting latitude
// const startLng = 29.89099803112387; // Example starting longitude
// const endLat = 52.808064; // Example ending latitude
// const endLng = 29.88258900000001; // Example ending longitude

// function sendFakeLocations() {
//     try {
//         const socket = io(`http://localhost:4000`, {
//             reconnectionDelayMax: 10000,
//             autoConnect: true,
//             path: import.meta.env.VITE_SOCKET_PATH,
//             auth: {
//                 token: localStorage.getItem("bearer_token")
//             },
//         });

//         socket.on('connect', () => {
//             let locations = [];
//             for (let i = 0; i < 2; i++) {
//                 const lat = getRandomLocation(startLat, endLat);
//                 const lng = getRandomLocation(startLng, endLng);
//                 const bearing = getRandomBearing();
//                 locations.push({ lat, lng, bearing });
//             }

//             const EVENT_GPS_UPDATE = 'event-gps-update';
//             socket.emit(EVENT_GPS_UPDATE, JSON.stringify(locations)); // Ensure payload is a JSON string
//         });

//         socket.on('disconnect', () => {
//             console.log('Disconnected from server');
//         });
//     } catch (error) {
//         console.error("Error in sendFakeLocations:", error);
//     }
// }
