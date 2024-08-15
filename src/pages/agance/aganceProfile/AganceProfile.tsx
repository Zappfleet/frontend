import React, { useEffect, useRef, useState } from 'react';
import './style.scss';
import '../aganceRegister/style.scss'
import ObjectId from 'bson-objectid';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import moment from 'jalali-moment';
import FileUpload, { FileUploadHandles } from '../../../components/FileUpload/FileUpload';
import useAganceCarteSalahiyat from '../../../hooks/data/Agance/useCarteSalahiyat';
import { NotificationController } from '../../../lib/notificationController';
import DataGrid from '../../../components/DataGrid/DataGrid';
import { MdOutlinePlaylistAddCheckCircle } from 'react-icons/md';
import { convertDateToISO } from '../../../utils/dateTools';
import useAganceDriver from '../../../hooks/data/Agance/useAganceDriver';
import WordProcessor from '../../../components/Exports/WordProcessor/WordProcessor';
import wordFile from '../../../lib/zarghan/carteSalahiyat.docx';
import useGetAganceProfileByDriverId from '../../../hooks/data/Agance/useGetAganceProfileByDriverId';
import useUsers from '../../../hooks/data/useUsers';
import PlaqueInput from '../../Form/PlaqueInput';
import { convertStringToPlaque } from '../../../lib/string';
import { convertGregorianToJalali, getBase64WithFileName } from '../../../utils/utils';
import * as permitConstant from '../../../lib/constants'
import useAuthentication from '../../../hooks/data/useAuthentication';

const AganceProfile = ({ handleBackClick, title }: any) => {

    title = 'پروفایل'
    const { authInfo } = useAuthentication();
    const [theadCRUD, setTheadCRUD] = useState<any>('')
    const [permit, setPermit] = useState<any>({
        CREATE: false,
        EDIT: false,
        DELETE: false
    })

    useEffect(() => {

        let newPermit = {
            CREATE: false,
            EDIT: false,
            DELETE: false
        }
        let thead_crud = ''
        authInfo?.auth?.roles?.map((role: any) => {
            role.permissions.map((permission: any) => {
                if (permission === permitConstant.PERMIT_AGANCE_PROFILE_CREATE) {
                    newPermit.CREATE = true
                }
                if (permission === permitConstant.PERMIT_AGANCE_PROFILE_EDIT) {
                    newPermit.EDIT = true
                    thead_crud += '- update -'
                }
                if (permission === permitConstant.PERMIT_AGANCE_PROFILE_DELETE) {
                    newPermit.DELETE = true
                    thead_crud += '- delete -'
                }
            })
        })
        setPermit(newPermit)
        setTheadCRUD(thead_crud)
    }, [authInfo])

    const [driverId, setDriverId] = useState<any>(undefined)
    const [refreshReport, setRefreshReport] = useState<any>(false)
    const { result, type: respType, state, refreshData } = useAganceDriver('select', null)
    const { result: resultReport } = useGetAganceProfileByDriverId(refreshReport, driverId)

    const [driverPic, setDriverPic] = useState<string | undefined>(undefined);

    const [showAttchImage, setShowAttchImage] = useState<any>(false)
    const [attchImageSrc, setAttchImageSrc] = useState<any>('')
    const [InsertOrUpdate, setInsertOrUpdate] = useState<any>('insert')
    const [selectedTab, setSelectedTab] = useState<any>('list')

    const [imagesBase64, setImagesBase64] = useState<any>({});


    useEffect(() => {
        if (driverId) {
            setRefreshReport(!refreshReport)
        }
    }, [driverId])

    useEffect(() => {
        console.log(23);

    }, [driverPic])

    //aganceDriver
    const options = [{ id: 1, value: 10 }, { id: 2, value: 30 }, { id: 3, value: 50 }]
    const thead = [
        // { key: 'id', name: 'شناسه' },
        { key: '', name: theadCRUD },
        { key: 'full_name', name: 'نام و نام خانوادگی', img: false },
        { key: 'driverNatNum', name: 'کد ملی' },
        // { key: 'shomareParvane', name: ' تاریخ شروع  فعالیت', type: 'caleadar', key2: 'fromdate' },
    ]

    //profile
    const optionsReport = [{ id: 1, value: 10 }, { id: 2, value: 30 }, { id: 3, value: 50 }]
    const theadReport = [
        // { key: 'id', name: 'شناسه' },
        // { key: '', name: '' },
        { key: 'name', name: 'عنوان', img: false },
        { key: 'date', name: 'تاریخ', type: 'caleadar', key2: 'fromdate' },
        // { key: 'shomareParvane', name: ' تاریخ شروع  فعالیت', type: 'caleadar', key2: 'fromdate' },
    ]

    const [aganceDrivers, setAganceDrivers] = useState<any[]>([])

    const [aganceProfile, setAganceProfile] = useState<any[]>([])


    useEffect(() => {
        if (result) {
            customizeAndSetAganceDrivers(result?.data?.data)
        }
    }, [result])


    useEffect(() => {
        if (resultReport) {
            clearFormInputs()
            customizeAndSetAganceProfile(resultReport?.data?.data)
        }
    }, [resultReport])


    const customizeAndSetAganceDrivers = (data: any) => {
        setAganceDrivers(() => {
            return data.map((ite: any) => ({
                ...ite,
                driverNatNum: ite?.details?.nat_num,
            }));
        });
    }



    const customizeAndSetAganceProfile = async (data: any) => {
        setAganceProfile(() => {
            return data.map((ite: any) => ({
                ...ite, allActivity: ite.allActivity.map((prev: any) => ({
                    ...prev,
                    date: convertGregorianToJalali(prev.date)
                }))
                // StartActivityDate: convertGregorianToJalali(ite.StartActivityDate),
            }));
        });

        if (data[0]?.driverInfo[0]?.details?.attachFile?.driverPic) {
            setDriverPic(await getBase64WithFileName(data[0]?.driverInfo[0]?.details?.attachFile?.driverPic));
        }
    }

    const clearFormInputs = () => {

        setAganceProfile([])
        clearAllFileUpload()
        setShowAttchImage(false)
        setAttchImageSrc('')
        setImagesBase64({})
        setInsertOrUpdate('insert')
    }

    const clearAllFileUpload = () => {
        // clearFileUpload('moarrefiNameMahaleFaaliyat')
        // clearFileUpload('fishPic')
    }



    const clickOnRowDataGrid = (item: any, type: any) => {
        if (type === 'view') {
            setDriverId(item?._id)
        }
    }

    const showAttachImage = (name: any) => {
        setAttchImageSrc(imagesBase64[name])
        setShowAttchImage(true)
    }


    return (

        <div className='agance-profile-component agance-component'>
            {handleBackClick && <i className='fa fa-arrow-left back-icon' onClick={handleBackClick}></i>}

            {showAttchImage && <div className="myAttachImage">
                <img className="upload-img" src={attchImageSrc} />
                <i className='fa fa-remove close-icon' onClick={() => { setShowAttchImage(false), setAttchImageSrc('') }}></i>
            </div>}


            <div className="row">
                <div className="col-12">
                    <div className="page-title">
                        <i onClick={() => { setSelectedTab('list'); }} className={selectedTab === 'list' ? 'active' : ''}>{'لیست پروفایل ها'}</i>
                    </div>
                    <div className="page-title">
                        <i onClick={() => { setSelectedTab('insert'); }} className={selectedTab === 'insert' ? 'active' : ''}>{InsertOrUpdate === 'insert' ? title : 'پروفایل '}</i>
                    </div>
                </div>
            </div>

            <div style={{ display: `${selectedTab === 'list' ? '' : 'none'}` }} className="row">
                <div className="col-12">
                    {aganceDrivers?.length > 0 &&
                        <DataGrid
                            clickOnRow={clickOnRowDataGrid}
                            pagesize={options[0].value}
                            items={aganceDrivers}
                            options={options}
                            thead={thead}
                        />
                    }
                    {aganceDrivers?.length <= 0 && <p style={{ marginTop: '40px' }}> {'موردی برای نمایش وجود ندارد'}</p>}
                </div>
            </div>


            <div style={{ display: `${selectedTab === 'insert' ? '' : 'none'}` }} className='aganceRegister-component'>

                <div className="part part1">
                    <div className="row title">
                        <div className="col-12 ">
                            <div className="page-title"> اطلاعات هویتی</div>
                            <hr className='hr-title' />
                        </div>
                    </div>
                    <div className="row items">
                        <img src={driverPic} alt="" className='img-driverPic' />
                        <div className="col-12">
                            <span>نام و نام خانوادگی</span>
                            <span> {aganceProfile[0]?.driverInfo[0]?.full_name}</span>
                        </div>
                        <div className="col-12">
                            <span>کد ملی</span>
                            <span> {aganceProfile[0]?.driverInfo[0]?.details?.nat_num}</span>
                        </div>
                        <div className="col-12">
                            <span>   شماره تماس</span>
                            <span> {aganceProfile[0]?.driverInfo[0]?.phone}</span>
                        </div>
                    </div>
                </div>


                <div className="part part2">
                    <div className="row title">
                        <div className="col-12">
                            <div className="page-title"> اطلاعات خودرو</div>
                            <hr className='hr-title' />
                        </div>
                    </div>
                    <div className="row items">
                        <div className="col-12">
                            <span>   شماره پلاک</span>
                            <span>
                                {aganceProfile[0]?.vehicleInfo[0]?.plaque &&
                                    <PlaqueInput
                                        disabled={true}
                                        small={true}
                                        value={convertStringToPlaque(aganceProfile[0]?.vehicleInfo[0]?.plaque)}
                                    />
                                }
                            </span>
                        </div>
                        <div className="col-12">
                            <span>   نوع خودرو </span>
                            <span> {aganceProfile[0]?.vehicleInfo[0]?.extra?.type} </span>
                        </div>
                        <div className="col-12">
                            <span>   رنگ خودرو </span>
                            <span> {aganceProfile[0]?.vehicleInfo[0]?.extra?.color} </span>
                        </div>
                    </div>
                </div>


                <div className="part part3">
                    <div className="row title">
                        <div className="col-12">
                            <div className="page-title"> گزارش عملکرد </div>
                            <hr className='hr-title' />
                        </div>
                    </div>
                    <div className="row items">
                        <div className="col-12">
                            {aganceProfile[0]?.allActivity &&
                                <DataGrid
                                    pagesize={optionsReport[0].value}
                                    items={aganceProfile[0]?.allActivity}
                                    options={optionsReport}
                                    thead={theadReport}
                                />
                            }
                            {!aganceProfile[0]?.allActivity && <p style={{ marginTop: '40px' }}> {'موردی برای نمایش وجود ندارد'}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AganceProfile;;