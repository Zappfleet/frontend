import React, { useRef, useEffect, useState } from 'react';
import './style.scss'
import MapContainer from '../../widgets/map/MapContainer';
import MarkerRed from '../../images/map/marker-red.png';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { BiCheckCircle, BiEraser, BiMenu, BiTrash, BiX, BiXCircle } from 'react-icons/bi';
import classNames from 'classnames';
import { BsPin } from 'react-icons/bs';
import BottomSheetModal from '../../components/BottomSheetModal';
import useAuthentication from '../../hooks/data/useAuthentication';
import SuggestionTextInput from '../../widgets/SuggestionTextInput/SuggestionTextInput';
import usePermittedUsers from '../../hooks/data/usePermittedUsers';
import renderUi from '../../lib/renderUi';
import { INPUT_TYPE_LIST, INPUT_TYPE_TEXT } from '../../lib/constants';
import LoaderButton from '../../components/LoaderButton';
import { fillFormInputs, readFormInputs } from '../../lib/form';
import Chips from '../../components/Chips';
import { getApiClient } from '../../apis/client';
import { NotificationController } from '../../lib/notificationController';
import useRegions from '../../hooks/data/useRegions';
import useConfirmModal from '../../hooks/useConfirmModal/useConfirmModal';

import useCurrentUserPermissions from '../../hooks/useCurrentUserPermissions';
import {
    PERMIT_AREAS_CREATE,
    PERMIT_AREAS_EDIT,
    PERMIT_AREAS_DELETE,
    PERMIT_AREAS_LIST
} from '../../lib/constants'

const AreaManager = () => {


    const { hasPermitGroup, hasPermitFor, hasAdminRank, permits } =
        useCurrentUserPermissions();

    const [loading, setLoading] = useState<boolean>(false)
    const [permission_SUBMIT, setPermission_SUBMIT] = useState<boolean>(false)
    const [permission_EDIT, setPermission_EDIT] = useState<boolean>(false)
    const [permission_DELETE, setPermission_DELETE] = useState<boolean>(false)
    const [permission_LIST, setPermission_LIST] = useState<boolean>(false)

    useEffect(() => {
        setPermission_SUBMIT(hasPermitFor([PERMIT_AREAS_CREATE]))
        setPermission_EDIT(hasPermitFor([PERMIT_AREAS_EDIT]))
        setPermission_DELETE(hasPermitFor([PERMIT_AREAS_DELETE]))
        setPermission_LIST(hasPermitFor([PERMIT_AREAS_LIST]))

        // setLoading(true)
    }, [hasPermitFor])

    const formRef = useRef<any>();

    const { regions, refreshRegions } = useRegions();

    const { show: showConfirm, ui: ModalUi } = useConfirmModal();

    const [state, setState] = useState<any>({
        readyToSubmit: false,
        markerIsPlaced: false,
        displayAreaList: false,
    });

    const [data, setData] = useState<any>({
        dispatcher: null
    });

    const { authInfo } = useAuthentication();

    const bottomSheet = useRef<any>();

    const { refreshData: fetchUserData }: any = usePermittedUsers({
        permissions: ['SERVICE.ORG.DISPATCH'],
        include_external_base: true, // or false, depending on your requirement
        search_all: true, // or true, depending on your requirement; this is optional
    });

    const mapRef = useRef<any>();
    const activeAreaRef = useRef<any>({
        markers: [],
        polygonLayer: null
    });

    const areaPolygonList = useRef<any>([]);


    useEffect(() => {
        const t = setTimeout(() => {
            areaPolygonList.current.map(({ geo }: any) => {
                mapRef.current.remove(geo.polygon)
            })
            areaPolygonList.current = [];

            regions.map((region: any) => {
                const geo = mapRef.current.addPolygon(region.geometry.coordinates[0], true)
                areaPolygonList.current.push({ geo, region });
            })
        }, 300)
        return () => clearTimeout(t);
    }, [regions])


    const onBottomSheetCreate = (ui: any) => {
        bottomSheet.current = ui;
    }

    const handle_showBottomSheet = () => {
        bottomSheet.current.show();
    }

    const handle_hideBottomSheet = () => {
        bottomSheet.current.hide();
    }

    const handle_toggleDisplayList = () => {
        setState({ ...state, displayAreaList: !state.displayAreaList });
    }

    const handle_submitClick = (e: any) => {
        e.preventDefault();

        const isEditing = data.region != null;

        const formInput = readFormInputs(formRef);
        const title = formInput.title;

        delete formInput.title;
        delete formInput[""];

        const geometry = {
            type: "Polygon",
            coordinates: [activeAreaRef.current.polygonLayer.coordinates]
        }
        const body = {
            name: title,
            properties: formInput,
            geometry,
            dispatcher: data.dispatcher?._id
        }

        const method = isEditing ? "updateRegion" : "createRegion";
        getApiClient()[method](body, data.region?._id).then(() => {
            handle_hideBottomSheet();
            handle_clearEverything();
            NotificationController.showSuccess("اطلاعات با موفقیت ذخیره شد");
            refreshRegions();
        }).catch((e) => {
            NotificationController.showError(e.message);
        })
    }

    const handle_listItemClick = (region: any) => {
        clearActiveAreaGeo();
        setState({ ...state, displayAreaList: false });
        fillFormInputs(formRef, {
            title: region.name,
            ...region.properties,
        });
        setData({ dispatcher: region.dispatcher, region })

        const polygon = areaPolygonList.current.find((areaPolygon: any) => {
            return areaPolygon.region._id == region._id;
        })

        polygon.geo.coordinates.map((coordinate: any, index: number) => {
            if (index < polygon.geo.coordinates.length - 1) {
                const marker = mapRef.current.addMarker(coordinate[0], coordinate[1], true);
                activeAreaRef.current.markers.push(marker);
            }
        })
        updateActivePolygon();

    }

    const clearActiveAreaGeo = () => {
        activeAreaRef.current.markers.map((m: any) => {
            mapRef.current.remove(m.marker);
        })
        if (activeAreaRef.current?.polygonLayer?.polygon) {
            mapRef.current.remove(activeAreaRef.current.polygonLayer.polygon)
        }
        activeAreaRef.current.markers = [];
        activeAreaRef.current.polygonLayer = null;
    }

    const handle_deleteSelection = () => {
        showConfirm({
            title: "حذف محدوده",
            desc: `آیا از حذف محدوده اطمینان دارید?`,
            label_confirm: "حذف کن!",
            label_cancel: "خیر",
            onConfirm: () => {
                getApiClient().deleteRegion(data.region?._id).then(() => {
                    handle_hideBottomSheet();
                    handle_clearEverything();
                    NotificationController.showSuccess("اطلاعات با موفقیت حذف شد");
                    refreshRegions();
                }).catch((e) => {
                    NotificationController.showError(e.message);
                })
            }
        })

    }

    const handle_clearEverything = () => {
        setData({});
        fillFormInputs(formRef, { name: "" })
        clearActiveAreaGeo();

        setState({
            ...state,
            readyToSubmit: false,
            markerIsPlaced: false,
        })
    }

    const handle_backClick = () => {
        const lastMarker = activeAreaRef.current.markers.pop();
        if (lastMarker == null) return;
        mapRef.current.remove(lastMarker.marker);
        updateActivePolygon();
    }

    const handle_pinClick = () => {
        if (mapRef.current == null) return;
        const marker = mapRef.current.addMarkerToCenter();
        activeAreaRef.current.markers.push(marker);
        updateActivePolygon();
    }

    function updateActivePolygon() {
        if (activeAreaRef.current.polygonLayer != null) {
            mapRef.current.remove(activeAreaRef.current.polygonLayer.polygon)
            activeAreaRef.current.polygonLayer = null;
        }
        if (activeAreaRef.current.markers.length >= 2) {
            const polygonLayer = mapRef.current.addPolygon(activeAreaRef.current.markers.map((m: any) => {
                return m.coordinates
            }), true, "3, 252, 115");
            activeAreaRef.current.polygonLayer = polygonLayer;
        }

        const newStateArgs = {
            readyToSubmit: activeAreaRef.current.markers.length >= 3,
            markerIsPlaced: activeAreaRef.current.markers.length > 0
        }

        setState({ ...state, ...newStateArgs })
    }

    const handle_selectDispatcher = (item: any) => {
        setData({ ...data, dispatcher: item });
    }

    const readPermittedDispatchers = async function readPermittedDrivers(search: string): Promise<any[]> {
        return new Promise((resolve, reject) => fetchUserData(search).then(resolve).catch(reject));
    }


    return (
        <div className="AreaManager-component">
            <div className="main-div">
                <MapContainer mapRef={mapRef} />

                <img className="absolute bottom-2/4 left-2/4 w-8 -translate-x-2/4"
                    src={MarkerRed}
                />

                <i onClick={handle_toggleDisplayList} className='fa fa-bars btn-bars'></i>

                {renderUi(
                    <button onClick={handle_clearEverything} className='fixed right-2 lg:right-75 top-40 shadow bg-white active:saturate-50 w-14 h-14 p-3 flex justify-center items-center text-white p-3 rounded-full'>
                        <BiX className={"text-graydark "} size={40} />
                    </button>
                ).if(data.region != null)}

                {renderUi(
                    <>
                        {permission_DELETE === true &&
                            <button onClick={handle_deleteSelection} className='fixed right-2 lg:right-75 top-60 shadow bg-white active:saturate-50 w-14 h-14 p-3 flex justify-center items-center text-white p-3 rounded-full'>
                                <BiTrash className={"text-danger "} size={40} />
                            </button>
                        }
                        {permission_DELETE === false &&
                            <button disabled={true} className='NoPermission fixed right-2 lg:right-75 top-60 shadow bg-white active:saturate-50 w-14 h-14 p-3 flex justify-center items-center text-white p-3 rounded-full'>
                                <BiTrash className={"text-danger "} size={40} />
                            </button>
                        }
                    </>

                ).if(data.region != null)}

                <div className={classNames(
                    'areas-list-div',
                    {
                        "-translate-x-full": !state.displayAreaList,
                    }
                )}>
                    <div className='border-b border-gray-4'>
                        <BiX onClick={handle_toggleDisplayList} size={40} className={"p-2 cursor-pointer"} />
                    </div>

                    <div className='p-2 scroller'>
                        {
                            regions.map((region: any) => {
                                return <div
                                    onClick={() => handle_listItemClick(region)}
                                    className={classNames(
                                        'px-1 py-3 text-xs border-b border-gray-4 cursor-pointer active:bg-gray-2 hover:bg-gray-2',
                                        { "!bg-gray-4": data.region?._id == region._id }
                                    )}>
                                    {region.name}
                                </div>
                            })
                        }
                    </div>
                </div>


                <div className='fixed bottom-0 right-0 flex flex-col p-4 justify-between items-center lg:mr-72'>

                    {permission_SUBMIT === true &&
                        <button onClick={handle_showBottomSheet} className={
                            classNames('shadow duration-100 overflow-hidden bg-success active:saturate-50 flex justify-center items-center text-white rounded-full',
                                {
                                    "w-0 h-0 p-0": !state.readyToSubmit,
                                    "w-14 h-14 p-3": state.readyToSubmit
                                }
                            )
                        }>
                            <BiCheckCircle className={"p-0.5"} size={34} />
                        </button>
                    }
                    {permission_SUBMIT === false &&
                        <button
                            disabled={true}
                            className={
                                classNames(' NoPermission shadow duration-100 overflow-hidden bg-success active:saturate-50 flex justify-center items-center text-white rounded-full',
                                    {
                                        "w-0 h-0 p-0": !state.readyToSubmit,
                                        "w-14 h-14 p-3": state.readyToSubmit
                                    }
                                )
                            }>
                            <BiCheckCircle className={"p-0.5"} size={34} />
                        </button>
                    }

                    {permission_EDIT === true &&
                        <button onClick={handle_backClick} className={classNames(
                            'shadow duration-100 bg-white active:saturate-50 flex justify-center items-center text-white rounded-full',
                            {
                                "w-0 h-0 p-0 my-0": !state.markerIsPlaced,
                                "w-14 h-14 p-3 my-2": state.markerIsPlaced
                            }
                        )}>
                            <BiEraser className={"p-0.5 text-primary"} size={30} />
                        </button>
                    }
                    {permission_EDIT === false &&
                        <button disabled={true} className={classNames(
                            'NoPermission shadow duration-100 bg-white active:saturate-50 flex justify-center items-center text-white rounded-full',
                            {
                                "w-0 h-0 p-0 my-0": !state.markerIsPlaced,
                                "w-14 h-14 p-3 my-2": state.markerIsPlaced
                            }
                        )}>
                            <BiEraser className={"p-0.5 text-primary"} size={30} />
                        </button>
                    }

                    <button onClick={handle_pinClick} className='shadow  bg-primary active:saturate-50 w-14 h-14 flex justify-center items-center text-white p-3 rounded-full'>
                        <BsPin className={"p-0.5"} size={30} />
                    </button>


                </div>

                <BottomSheetModal onCreate={onBottomSheetCreate}>
                    <div className='px-2'>
                        <form className='py-6' ref={formRef}>
                            <div className='w-full'>
                                <label className='py-2 inline-block'>{"عنوان محدوده"}</label>
                                <input name={"title"} placeholder='عنوان' className='p-2 rounded w-full outline-none border border-gray-4 focus:border-primary' />
                            </div>
                            <div>
                                <div className='flex items-center'>
                                    <label className='pt-6 inline-block'>{"توزیع کننده ی محدوده"}</label>
                                    <span className='pt-6 mx-2 flex items-center'>
                                        <Chips className={"!text-lg !py-0"}>
                                            <span className='flex items-center'>
                                                {data.dispatcher?.full_name}
                                            </span>
                                        </Chips>
                                    </span>
                                </div>
                                <SuggestionTextInput
                                    showListOnTop={true}
                                    onSuggestionSelected={handle_selectDispatcher}
                                    placeholder='جستجوی توزیع کننده ها ...'
                                    readFromDataSource={readPermittedDispatchers}
                                    suggestionRenderer={(item) => (<div className='px-4 py-1'>{item.full_name}</div>)}
                                />

                            </div>

                            {authInfo?.org?.regionAdditionalProperties?.map((item: any) => {
                                return <div key={item.key}>
                                    <label className='py-2 inline-block'>{item.title}</label>
                                    {renderUi(<input className='w-full' name={item.key} />).if(item.type == INPUT_TYPE_TEXT)}
                                    {renderUi(
                                        <select className='w-full select-box' name={item.key}>
                                            {item.options?.map((option: any) => {
                                                return <option key={option.key} value={option.key}>{option.title}</option>
                                            })}
                                        </select>
                                    ).if(item.type == INPUT_TYPE_LIST)}
                                </div>
                            })}

                            <LoaderButton onClick={handle_submitClick} className={"mt-6 w-full"}>{"ثبت اطلاعات"}</LoaderButton>
                        </form>
                    </div>
                </BottomSheetModal>
                {ModalUi}
            </div>
        </div>

    );
};

export default AreaManager;