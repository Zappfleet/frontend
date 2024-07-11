import React, { useEffect, useRef, useState } from 'react';
import './style.scss'
import MapContainer, { MapRefType } from '../../../widgets/map/MapContainer';
import LocationSearch from '../../../widgets/LocationSearch/LocationSearch';
import useNeshanApi from '../../../hooks/data/useNeshanApi';
import useFavorite from '../../../hooks/data/Favorite/useFavorite';
import { NotificationController } from '../../../lib/notificationController';


const PassengerFavoriteLocation = () => {

    const [actionType, setActionType] = useState<any>('select')
    const [favoritItem, setFavoritItem] = useState<any>(null)
    const [refresh, setRefresh] = useState<boolean>(true)

    const { result: resultFavorite, type: hookType, refreshData } = useFavorite(refresh, actionType, favoritItem)

    const mapRef = useRef<MapRefType>();
    const { searchState } = useNeshanApi();
    const [showForm, setShowForm] = useState<any>(false)
    const [name, setName] = useState<any>('')
    const [des, setDes] = useState<any>('')
    const [coordinates, setCoordinates] = useState<any>()
    const [favoriteLocationList, setFavoriteLocationList] = useState<any>(null)
    const [is_Update, setIs_Update] = useState<any>(false)



    useEffect(() => {
    }, [favoriteLocationList, actionType])

    useEffect(() => {
        //console.log(1, actionType, resultFavorite);
        if (resultFavorite) {
           // console.log(2, actionType, resultFavorite);
            if (hookType === 'select') {
                if (resultFavorite.status === 200) {
                    setFavoriteLocationList(resultFavorite?.data);
                    setActionType('')
                    setRefresh(!refresh)
                    setShowForm(false)
                    setName('')
                    setDes('')
                }
            }
            if (hookType === 'insert') {
                if (resultFavorite.status === 200) {
                    NotificationController.showSuccess('مکان منتخب اضافه شد');
                    setActionType('select')
                    setRefresh(!refresh)
                } else {
                    NotificationController.showError('مکان منتخب اضافه نشد');
                }

            }
            if (hookType === 'delete') {
                if (resultFavorite.status === 200) {
                    NotificationController.showSuccess('مکان منتخب حذف شد');
                    setActionType('select')
                    setRefresh(!refresh)
                } else {
                    NotificationController.showError('مکان منتخب حذف نشد');
                }
            }
            if (hookType === 'update') {
                if (resultFavorite.status === 200) {
                    NotificationController.showSuccess('مکان منتخب بروزرسانی شد');
                    setIs_Update(false)
                    setActionType('select')
                    setRefresh(!refresh)
                    setShowForm(false)
                    setName('')
                    setDes('')
                } else {
                    NotificationController.showError('مکان منتخب بروزرسانی نشد');
                }
            }
            setShowForm(false)

        }
    }, [resultFavorite]);

    const selectFavorite = async () => {
        // setActionType('select')
        // setRefresh(true)
        // await refreshData()
    }

    const handle_clickPin = () => {
        if (searchState.inProgress || mapRef.current == null) return;
        const coordinates = mapRef.current.getCenterLonLat();
        if (coordinates == null) return;
        setCoordinates(coordinates)
        setShowForm(true)
    }

    const handle_saveFavorite = async () => {
        //update
        if (is_Update === true) {
            if (!coordinates || coordinates.length !== 2) {
                console.error('Invalid coordinates:', coordinates);
                return;
            }
            const favorite = favoritItem

            favorite.name = name,
                favorite.description = des,
                favorite.location = {
                    type: 'Point',
                    coordinates: coordinates // [longitude, latitude]
                }

            setActionType('update')
            setFavoritItem(favorite)
            setRefresh(!refresh)
            // Refresh the page after handling the deletion
            await refreshData()

        }
        //insert
        else {
            if (!coordinates || coordinates.length !== 2) {
                console.error('Invalid coordinates:', coordinates);
                return;
            }
            const favorite = {
                name: name,
                description: des,
                location: {
                    type: 'Point',
                    coordinates: coordinates // [longitude, latitude]
                }
            }
            setActionType('insert')
            setFavoritItem(favorite)
            setRefresh(!refresh)
            // Refresh the page after handling the deletion
            await refreshData()
        }

    }

    useEffect(() => {
       // console.log(33, refresh);
    }, [refresh])

    const handleRemoveFavorite = async (item: any) => {
        console.log(752);

        setActionType('delete');
        setFavoritItem(item);
        setRefresh(true);

        await refreshData();
    };

    // const refreshPage = async () => {
    //     console.log(777);

    //     setActionType('select')
    //     setFavoritItem(null)
    //     setRefresh(true);
    //     await refreshData()

    // }



    const handleEditFavorite = (item: any) => {
        const [lng, lat] = item?.location?.coordinates
        mapRef.current?.viewCoordinates(lng, lat, 16)
        setName(item.name)
        setDes(item.description)
        setFavoritItem(item);
        setIs_Update(true)
    }



    return (
        <div className="PassengerFavoriteLocation-component">
            <div className="row">
                <div className="col-12">
                    <div className="select">
                        {
                            favoriteLocationList?.map((item: any) => {
                                return <div className='favorite-name'>
                                    {item.name}
                                    <i onClick={(e) => handleRemoveFavorite(item)} className='fa fa-remove remove-icon'></i>
                                    <i onClick={(e) => handleEditFavorite(item)} className='fa fa-edit edit-icon'></i>
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="insert">
                        <div className="row">
                            <div className="col-12">
                                <div className="location-div">
                                    <MapContainer mapRef={mapRef as { current: MapRefType }} />

                                    <div className="marker-div">
                                        <i className='fa fa-map-marker marker-icon'></i>
                                        <span>منتخب</span>
                                    </div>

                                    <LocationSearch
                                        mapRef={mapRef}
                                        className="loc-search"
                                    />

                                    <i onClick={handle_clickPin} className='fa fa-check check-icon'></i>
                                </div>
                            </div>
                        </div>
                        {showForm &&
                            <div className="row">
                                <div className="col-12">
                                    <div className="favorite-form">
                                        <i onClick={() => setShowForm(false)} className='fa fa-arrow-left icon-back'></i>
                                        <input value={name} onChange={(e: any) => setName(e.target.value)} className='name form-control' type="text" placeholder='نام' />
                                        <textarea rows={5} value={des} onChange={(e: any) => setDes(e.target.value)} className='des form-control' placeholder='جزییات برای مسیریابی بهتر' />
                                        <button onClick={handle_saveFavorite} className='my-btn form-control'>{is_Update === true ? 'بروزرسانی' : 'ثبت'}</button>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>


        </div>
    );
};

export default PassengerFavoriteLocation;