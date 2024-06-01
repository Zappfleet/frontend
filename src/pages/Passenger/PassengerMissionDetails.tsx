import { useEffect, useRef, useState } from 'react';
import MapContainer, { MapRefType } from '../../widgets/map/MapContainer';
import LoaderButton from '../../components/LoaderButton';

import MarkerRed from '../../images/map/marker-red.png';
import BottomSheetModal from '../../components/BottomSheetModal';

import { RiArrowUpDoubleFill } from 'react-icons/ri';
import TripMissionDetails from './TripMissionDetails';
import LocationSearch from '../../widgets/LocationSearch/LocationSearch';
import { BsCarFront, BsPin, BsX } from 'react-icons/bs';
import { SmallLoader } from '../../common/Loader';
import classNames from 'classnames';
import useNeshanApi from '../../hooks/data/useNeshanApi';
import { MAP_COLOR_PRIMARY, NONE_KEY } from '../../lib/constants';
import { BiCheck, BiCheckCircle } from 'react-icons/bi';
import useAuthentication from '../../hooks/data/useAuthentication';
import { ModularInput } from '../../components/ModularInput';
import { readFormInputs } from '../../lib/form';
import useVehicleBasicData from '../../hooks/data/useVehicleBasicData';
import { serviceUnits } from '../../lib/string';
import { getApiClient } from '../../apis/client';
import { NotificationController } from '../../lib/notificationController';

const PassengerMissionDetails = (props: any) => {

    const { searchState, reverseGeocoding } = useNeshanApi();


    const { data: vehicleData }: any = useVehicleBasicData({ include_inactive: false });

    const { authInfo } = useAuthentication();

    const mapRef = useRef<MapRefType>();
    const bottomSheet = useRef<any>();

    const [formState, setFormState] = useState<any>(props.initialValues || {});

    const [userInput, setUserInput] = useState<any>({
        locations: []
    });

    const mapLayers = useRef<any>({
        polyline: null,
    });

    const [uiState, setUiState] = useState<any>({
        readyForSubmit: false,
    })



    useEffect(() => {
        updateInbetweenLines(userInput.locations);
    }, [userInput])

    useEffect(() => {
        if (props.initialLocations == null) return;
        const locations = props.initialLocations.map(({ address, lat, lng }: any) => {
            return {
                address,
                lat,
                lng,
                marker: mapRef.current?.addMarker(lng, lat, true),
            }
        })
        setUserInput({ ...userInput, locations })
        setUiState({
            ...uiState,
            readyForSubmit: locations.length > 1
        })
    }, [])


    const updateInbetweenLines = (newLocations: any) => {
        if (searchState.inProgress || mapRef.current == null) return;

        if (mapLayers.current.polyline != null) {
            mapRef.current.remove(mapLayers.current.polyline.polyline)
            mapLayers.current.polyline = null;
        }
        if ((newLocations || userInput.locations).length > 1) {
            const addPolylineResult = mapRef.current.addPolyline((newLocations || userInput.locations).map((m: any) => {
                return [m.lng, m.lat]
            }), true, MAP_COLOR_PRIMARY);
            if (addPolylineResult == null) return;

            mapLayers.current.polyline = addPolylineResult;
        }

        setUiState({
            ...uiState,
            readyForSubmit: newLocations.length > 1
        })

    }


    const handle_deleteLocation = (index: number) => {

        const itemToRemove = userInput.locations[index];
        mapRef.current?.remove(itemToRemove.marker);

        userInput.locations.splice(index, 1)
        const newLocations = [...userInput.locations];
        setUserInput({
            ...userInput, locations: newLocations
        })
    }

    const onBottomSheetCreate = (ui: any) => {
        bottomSheet.current = ui;
    }

    const handle_showBottomSheet = () => {
        bottomSheet.current.show();
    }
    const handle_hideBottomSheet = () => {
        bottomSheet.current.hide();
    }

    const clearMapMarkers = () => {
        userInput.locations.map(({ marker }: any) => {
            mapRef.current?.remove(marker);
        })
        setUserInput({
            ...userInput, locations: []
        })
        updateInbetweenLines([])
    }

    const handle_submitRequest = (e: any) => {
        e.preventDefault();

        const body: any = {}

        const { service, datetime, ...rest } = formState;

        if (datetime != null) {
            body.gmt_for_date = datetime.map((v: any) => {
                if (typeof v === 'string' || v instanceof String) return v;
                return v.toDate().toISOString();
            })
        }
        body.details = rest;
        body.service = service;
        body.locations = userInput.locations.map((loc: any) => {
            const { lng, lat, ...rest } = loc;
            delete rest.marker;
            return {
                coordinates: [lat, lng],
                wait: 0,
                meta: rest
            }
        });

        // submitRequest
        // updateRequest
        const method = formState._id == null ? "submitRequest" : "updateRequest";
        getApiClient()[method](body, formState._id).then(({ data }) => {
            NotificationController.showSuccess("اطلاعات با موفقیت ذخیره شد");
            setFormState({});
            clearMapMarkers();
            handle_hideBottomSheet();
            if (props.submitCallback != null)
                props.submitCallback(data);
        }).catch((e) => {
            NotificationController.showError(e.message)
        })

    }

    const handle_onInputChanged = (e: any) => {
        
        setFormState({ ...formState, [e.target.name]: e.target.value })
    }


    return (
        <div className={classNames('absolute left-0 right-0 bottom-0 top-18', props.className)}>
            <MapContainer mapRef={mapRef as { current: MapRefType }} />

            <img
                className='absolute z-999999 left-2/4 -translate-x-2/4 bottom-2/4 w-8'
                src={MarkerRed} />

            <div className='absolute bottom-0 right-0 p-1 z-999999'>

                {userInput.locations.map((item: any, index: number) => {
                    return <div>
                        <span key={`${item.lat}${item.lng}`} className='relative shadow inline-block bg-white text-black text-xs py-2 pl-4 mx-2 my-1 rounded-2xl'>
                            <BsX onClick={() => handle_deleteLocation(index)} size={20} className={"-right-3 top-1/2 -translate-y-1/2 flex absolute bg-danger rounded-full text-white h-7 w-7 cursor-pointer "} />
                            <span className='pr-6 inline-block'>{item.address}</span>
                        </span>
                    </div>
                })}

                <span className='flex'>
                    <button onClick={handle_showBottomSheet} className='shadow bg-primary active:saturate-50 w-14 h-14 flex justify-center items-center text-white p-3 m-2 rounded-full cursor-pointer text-primary'>
                        <BsCarFront
                            className={classNames(
                                "duration-200 p-0.5 text-white absolute",
                            )} size={30} />
                    </button>

                    <button onClick={handle_showBottomSheet} className={classNames(
                        'duration-300 shadow bg-success active:saturate-50 w-14 h-14 flex justify-center items-center text-white p-3 m-2 rounded-full cursor-pointer text-primary',
                        {
                            "scale-100": uiState.readyForSubmit,
                            "scale-0": !uiState.readyForSubmit,
                        }
                    )}>
                        <BiCheck className={classNames(
                            "duration-200 p-0.5 text-white absolute",
                        )} size={40} />
                    </button>
                </span>



            </div>

            <BottomSheetModal onCreate={onBottomSheetCreate}>
                <div>
                    <TripMissionDetails />
                </div>
            </BottomSheetModal>
        </div>
    );
};

export default PassengerMissionDetails;