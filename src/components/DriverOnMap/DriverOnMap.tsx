import React, { memo, useContext, useEffect, useMemo, useState } from 'react';
import useSWR from "swr";
import axios from 'axios';
import * as ReactDOMServer from "react-dom/server";
//import carIcon from '../../images/map/carIcon.png';
import L, { latLngBounds, marker } from "leaflet";
import CarSvg from '../../images/map/carIcon'


import {
    MapContainer,
    TileLayer,
    LayerGroup,
    Popup,
    Marker,
    Tooltip,
    useMapEvents,
} from "react-leaflet";


export const carIcon = (fill: any) => {
    return L.divIcon({
        iconSize: [45, 95],
        // tooltipAnchor: [22, 94],
        html: ReactDOMServer.renderToString(<CarSvg fill={fill} />),
    });
};

const DriverOnMap = ({ mapRef }: any) => {
    const settings = {
        apiUrl: "http://localhost:5173",
        imgUrl: "http://localhost:5173/images/",
        NESHAN_API_KEY: "service.k4icu6pAM41wDqS4dxiLPRGYaoHEmzAftrBWhR9J",
        INITIAL_VIEW: [32.6539, 51.666],
    };

    const [carPoints, setCarPoints] = useState<any>([]);
    const [cars, setCars] = useState<any>([]);
    const fakeSocket = { on: () => { }, is_fake: true, off: () => { } };
    const [socket, setSocket] = useState<any>(fakeSocket);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/v2/favoriteLocations/getCars');
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json();
                const newCars = data?.docs.map((car: any) => ({
                    value: car?._id,
                    label: car?.driver?.user?.full_name,
                    ...car,
                }));
                setCars(newCars);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCars();
    }, []);

    useEffect(() => {
        socket.on("car-status-changed", ({ car }: any) => {
            setCars((prevCars: any) => {
                if (Array.isArray(prevCars)) {
                    const result = prevCars.filter((c) => c._id !== car._id);
                    return [
                        ...result,
                        {
                            value: car?._id,
                            label: car?.driver?.user?.full_name,
                            ...car,
                        },
                    ];
                } else {
                    return [
                        {
                            value: car?._id,
                            label: car?.driver?.user?.full_name,
                            ...car,
                        },
                    ];
                }
            });
        });
    }, [socket]);

    useMemo(() => {
        const carStarts = cars?.map(({ driver, _id, plaque, name_code, total_distance, status }: any) => {
            if (driver && driver?.user && driver?.location.length > 1) {
                const { location, user } = driver;
                return {
                    _id,
                    status,
                    plaque,
                    name_code,
                    total_distance,
                    latlng: [location[1], location[0]],
                    full_name: user.full_name,
                };
            }
            return null;
        }).filter((car: any) => car !== null);
        setCarPoints(carStarts);
    }, [cars]);

    const DriverMarkers = memo(({ carPoints, carMarkerEventHandler }: any) => {
        return (
            <>
                {carPoints?.map((car: any) => {
                    if (car && car.latlng[0] && car.latlng[1]) {
                        return (
                            <Marker
                                key={car._id}
                                position={car.latlng}
                                icon={car.status ? carIcon("red") : carIcon("green")}
                                eventHandlers={carMarkerEventHandler(car._id)}
                            />
                        );
                    }
                    return null;
                })}
            </>
        );
    });

    const onShowCarDetails = (id: any) => {
        console.log("show car details", id);
    };

    const [tripDrafts, setTripDrafts] = useState([]);
    const [sureModal, setSureModal] = useState({
        opened: false,
        trip_id: null,
        car_id: null,
    });

    const handleAddCarToTripDraft = (id: any) => {
        let tripDraftIndex: any;
        const car = cars.find((c: any) => c._id === id);
        const newTripDrafts: any = [...tripDrafts];
        const tripDraft: any = newTripDrafts.find((t: any, index: any) => {
            if (t.active === true) {
                tripDraftIndex = index;
                return true;
            }
            return false;
        });
        if (!tripDraft) return;
        if (!tripDraft.frontCreated && tripDraft?.car?._id) {
            setSureModal({
                opened: true,
                trip_id: tripDraft.id,
                car_id: id,
            });
            return;
        }
        tripDraft.car = car;
        newTripDrafts[tripDraftIndex] = tripDraft;
        setTripDrafts(newTripDrafts);
    };

    const carMarkerEventHandler = (id: any) => ({
        dblclick: () => onShowCarDetails(id),
        click: () => handleAddCarToTripDraft(id),
    });

    return null
    return (
        <MapContainer
            center={[29.882589, 52.808064]}
            zoom={14}
            style={{ height: "100vh", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {cars && (
                <DriverMarkers
                    carPoints={carPoints}
                    carMarkerEventHandler={carMarkerEventHandler}
                />
            )}

        </MapContainer>
    );
};


export default DriverOnMap;