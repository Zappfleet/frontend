import React, { useEffect, useRef, useState } from 'react';
import './style.scss';
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
import { convertEnglishToPersianDigits, convertGregorianToJalali, persianDateToGregorian } from '../../../utils/utils';
import { convertDateToISO } from '../../../utils/dateTools';
import useAganceDriver from '../../../hooks/data/Agance/useAganceDriver';
import WordProcessor from '../../../components/Exports/WordProcessor/WordProcessor';
import wordFile from '../../../lib/zarghan/carteSalahiyat.docx';
import { useValidateForm } from '../../../utils/validation';
import useAuthentication from '../../../hooks/data/useAuthentication';
import * as permitConstant from '../../../lib/constants'
import Page403 from '../../../components/Page403/Page403';

interface carte_salahiyat {
    _id: string,
    id: string,
    fishNumber?: string,
    fishPrice?: string,
    fishDate?: string,
    attachFile?: {
        moarrefiNameMahaleFaaliyat?: string;
        fishPic?: string;
    };
    driverId?: string,
    driverFullName?: string,
    driverNatNum?: string,
    shomareParvane?: string,
    status?: string,
    year?: string,
    fromDate?: string,
    toDate?: string
    etebarHistory?: [
        { status?: string, year?: string, fromDate?: string, toDate?: string }
    ]
}
const validationRules: any = {
    fishNumber: {
        required: true,
        showName: 'شماره فیش'
    },
    fishPrice: {
        required: true,
        min: 100,
        showName: 'مبلغ فیش'
    },
    fishDate: {
        required: true,
        showName: 'تاریخ فیش'
    },
    attachFile: {
        required: true,
        showName: 'تصویر درخواست تمدید یا معرفی نامه محل فعالیت  '
    },
    // name: {
    //     required: true,
    //     show: false
    // },
    // email: {
    //     required: true,
    //     pattern: /^\S+@\S+\.\S+$/,
    //     show: false
    // },
    // password: {
    //     required: true,
    //     minLength: 6,
    //     show: false
    // },
    // // confirmPassword: {
    // //     required: true,
    // //     match: true,
    // //     show: false

    // // },
};

const initialValue = {
    fishNumber: '',
    fishPrice: '',
    fishDate: '',
    attachFile: undefined
}
const CardSalahiyat = ({ handleBackClick, title }: any) => {
    title = 'صدور کارت صلاحیت'


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
                if (permission === permitConstant.PERMIT_AGANCE_CART_SALAHIYAT_CREATE) {
                    newPermit.CREATE = true
                }
                if (permission === permitConstant.PERMIT_AGANCE_CART_SALAHIYAT_EDIT) {
                    newPermit.EDIT = true
                    thead_crud += '- update -'
                }
                if (permission === permitConstant.PERMIT_AGANCE_CART_SALAHIYAT_DELETE) {
                    newPermit.DELETE = true
                    thead_crud += '- delete -'
                }
            })
        })
        setPermit(newPermit)
        setTheadCRUD(thead_crud)
    }, [authInfo])

    const fileUploadRef_moarrefiNameMahaleFaaliyat = useRef<FileUploadHandles>(null);
    const fileUploadRef_fishPic = useRef<FileUploadHandles>(null);

    const clearFileUpload = (name: any) => {
        if (name.current) {
            name.current.clearFileInput();
        }
    }

    // Create a ref to store the ObjectId, ensuring it only gets generated once
    const objectIdRef = useRef(new ObjectId());

    // Extract the ObjectId from the ref
    const objectId = objectIdRef.current;

    useEffect(() => {
        setFields({ ...fields, _id: objectId.toString() })
    }, [objectId])


    const [showAttchImage, setShowAttchImage] = useState<any>(false)
    const [attchImageSrc, setAttchImageSrc] = useState<any>('')
    const [action_name, setActionName] = useState<any>('select')
    const [InsertOrUpdate, setInsertOrUpdate] = useState<any>('insert')
    const [selectedTab, setSelectedTab] = useState<any>('list')

    const [fishDateDatePicker, setFishDateDatePicker] = useState<any>(moment(new Date()).format('jYYYY/jMM/jDD'));
    const [fishDate, setFishDate] = useState<any>(moment(new Date()).format('jYYYY/jMM/jDD'));
    const [fromDateDatePicker, setFromDateDatePicker] = useState<any>(moment(new Date()).format('jYYYY/jMM/jDD'));
    const [fromDate, setFromDate] = useState<any>(moment(new Date()).format('jYYYY/jMM/jDD'));
    const [toDateDatePicker, setToDateDatePicker] = useState<any>(moment(new Date()).format('jYYYY/jMM/jDD'));
    const [toDate, setToDate] = useState<any>(moment(new Date()).format('jYYYY/jMM/jDD'));

    const [showAlert, setShowAlert] = useState<any>(false)
    const [imagesBase64, setImagesBase64] = useState<any>({});
    const [fields, setFields] = useState<Partial<carte_salahiyat>>(initialValue);


    const options = [{ id: 1, value: 10 }, { id: 2, value: 30 }, { id: 3, value: 50 }]
    const thead = [
        // { key: 'id', name: 'شناسه' },
        { key: '', name: theadCRUD },
        { key: 'driverFullName', name: 'نام و نام خانوادگی', img: false },
        { key: 'driverNatNum', name: 'کد ملی' },
        { key: 'shomareParvane', name: 'شماره پرونده' },
        // { key: 'shomareParvane', name: ' تاریخ شروع  فعالیت', type: 'caleadar', key2: 'fromdate' },
    ]

    const [ItemsList, setItemsList] = useState<any[]>([])
    const [OriginalItems, setOriginalItems] = useState<any[]>([])

    const [aganceDriversList, setAganceDriversList] = useState<any[]>([])


    const { result: resulAgancetDriver } = useAganceDriver('select', null)
    const { result, type: respType, state, refreshData } = useAganceCarteSalahiyat(action_name, fields)

    //validate
    const { errors: validateErrors, refreshData: validateRefreshData } = useValidateForm(validationRules, fields)



    useEffect(() => {
        if (resulAgancetDriver) {
            setAganceDriversList(resulAgancetDriver?.data?.data)
        }
    }, [resulAgancetDriver])

    useEffect(() => {
        console.log(400, aganceDriversList);
    }, [aganceDriversList])

    useEffect(() => {
        if (result) {
            switch (respType) {
                case 'insert':
                    if (result?.status === 200) {
                        NotificationController.showSuccess('کارت  صلاحیت ثبت شد')
                        setActionName('select')
                    }
                    else {
                        NotificationController.showError('کارت  صلاحیت ثبت نشد')
                    }
                    break;
                case 'update':
                    if (result?.status === 200) {
                        NotificationController.showSuccess('کارت  صلاحیت ویرایش شد')
                        setActionName('select')
                    }
                    else {
                        NotificationController.showError('کارت  صلاحیت ویرایش نشد')
                    }
                    break;
                case 'delete':
                    if (result?.status === 200) {
                        NotificationController.showSuccess('کارت  صلاحیت حذف شد')
                        setActionName('select')
                    }
                    else {
                        NotificationController.showError('کارت  صلاحیت حذف نشد')
                    }
                    break;
                case 'select':
                    setOriginalItems(result?.data?.data)
                    customizeAndSetItems(result?.data?.data)
                    clearFormInputs()
                    break;
            }
        }
    }, [result])


    const customizeAndSetItems = (data: any) => {
        setItemsList(() => {
            return data.map((ite: any) => ({
                ...ite,
                // StartActivityDate: convertGregorianToJalali(ite.StartActivityDate),
            }));
        });

        // data?.map((item: any) => {
        //     console.log(421, convertGregorianToJalali('2024-07-21T09:58:06.688+00:00'));

        // })
    }
    const clearFormInputs = () => {

        setFishDateDatePicker(moment(new Date()).format('jYYYY/jMM/jDD'));
        setFishDate(moment(new Date()).format('jYYYY/jMM/jDD'));

        setFromDateDatePicker(moment(new Date()).format('jYYYY/jMM/jDD'));
        setFromDate(moment(new Date()).format('jYYYY/jMM/jDD'));

        setToDateDatePicker(moment(new Date()).format('jYYYY/jMM/jDD'));
        setToDate(moment(new Date()).format('jYYYY/jMM/jDD'));

        clearAllFileUpload()

        setShowAttchImage(false)
        setAttchImageSrc('')
        objectIdRef.current = new ObjectId();
        setFields(initialValue)
        setImagesBase64({})
        setActionName(null)
        setInsertOrUpdate('insert')
    }

    const clearAllFileUpload = () => {
        clearFileUpload('moarrefiNameMahaleFaaliyat')
        clearFileUpload('fishPic')
    }

    const handleChangeFishDate = (date: any) => {
        setFishDateDatePicker(date);
        setFishDate(date.format('YYYY/MM/DD', { calendar: 'persian', locale: 'fa' }))
        setFields({ ...fields, fishDate: convertDateToISO(persianDateToGregorian(date.format('YYYY/MM/DD', { calendar: 'persian', locale: 'fa' }))) })
    }

    const handleChangeFromDate = (date: any) => {
        setFromDateDatePicker(date);
        setFromDate(date.format('YYYY/MM/DD', { calendar: 'persian', locale: 'fa' }))
        setFields({ ...fields, fromDate: convertDateToISO(persianDateToGregorian(date.format('YYYY/MM/DD', { calendar: 'persian', locale: 'fa' }))) })
    }

    const handleChangeToDate = (date: any) => {
        setToDateDatePicker(date);
        setToDate(date.format('YYYY/MM/DD', { calendar: 'persian', locale: 'fa' }))
        setFields({ ...fields, toDate: convertDateToISO(persianDateToGregorian(date.format('YYYY/MM/DD', { calendar: 'persian', locale: 'fa' }))) })
    }

    // useEffect(() => {
    //     setFields({ ...fields, StartActivityDate: StartActivityDate })
    // }, [StartActivityDate])

    const handleGetBase64 = (base64: any, fieldName: any, fieldValue: any, isRef: boolean) => {

        setImagesBase64((prevImagesBase64: any) => ({
            ...prevImagesBase64,
            [fieldName]: base64
        }))

        if (isRef === false) {
            setFields({ ...fields, attachFile: { ...fields.attachFile, [fieldName]: fieldValue } })
        }
    }


    useEffect(() => {
        console.log(200, imagesBase64);

    }, [imagesBase64])


    const handleClick = (type: any) => {
        switch (type) {
            case 'insert':
                setActionName('insert')
                break;

            case 'update':
                setActionName('update')
                break;
        }
    }

    const clickOnRowDataGrid = (item: carte_salahiyat, type: any) => {

        if (type === 'delete') {
            setFields(item)
            setActionName('delete')
        }
        if (type === 'update') {

            clearAllFileUpload()

            const updateItem: carte_salahiyat = (OriginalItems.filter((e: any) => e._id === item._id))[0]

            updateItem?.attachFile?.moarrefiNameMahaleFaaliyat && fileUploadRef_moarrefiNameMahaleFaaliyat.current?.setFileInput(updateItem?.attachFile?.moarrefiNameMahaleFaaliyat)
            updateItem?.attachFile?.fishPic && fileUploadRef_fishPic.current?.setFileInput(updateItem?.attachFile?.fishPic)

            setFishDateDatePicker(moment(updateItem.fishDate).format('jYYYY/jMM/jDD'));
            setFromDateDatePicker(moment(updateItem.fromDate).format('jYYYY/jMM/jDD'));
            setToDate(moment(updateItem.toDate).format('jYYYY/jMM/jDD'));

            setFields(updateItem)
            setInsertOrUpdate('update')
        }
    }

    useEffect(() => {
    }, [fields])


    useEffect(() => {
        //  console.log(100,attchImageSrc);

    }, [attchImageSrc])

    const showAttachImage = (name: any) => {
        //  console.log(700,imagesBase64[name]);

        setAttchImageSrc(imagesBase64[name])
        setShowAttchImage(true)
    }


    return (

        <div className='agance-component'>
            {handleBackClick && <i className='fa fa-arrow-left back-icon' onClick={handleBackClick}></i>}

            {/* {showAlert && <div className="myalert">
                <div className="alert alert-info alert-dismissible">
                     <i className='fa fa-remove close-icon' onClick={() => setShowAlert(false)}></i>
                    <p>{`کاربر محترم ، افراد متقاضی دریافت پروانه کارت  صلاحیت باید حائز شرایط زیر باشند`}
                        <i className='far fa-grin-beam eimoji-icon'></i>
                    </p>
                    <p> {`متاهل یا دارای فرم کفالت و سرپرستی خانواده، بدون شغل و پروانه کسب`}</p>
                    <button className='my-btn' onClick={() => setShowAlert(false)}>متوجه شدم </button>
                </div>
            </div>
            } */}

            {showAttchImage && <div className="myAttachImage">
                <img className="upload-img" src={attchImageSrc} />
                <i className='fa fa-remove close-icon' onClick={() => { setShowAttchImage(false), setAttchImageSrc('') }}></i>
            </div>}


            <div className="row">
                <div className="col-12">
                    <div className="page-title">
                        <i onClick={() => { setSelectedTab('list'); setShowAlert(false) }} className={selectedTab === 'list' ? 'active' : ''}>{'لیست کارت  صلاحیت ها'}</i>
                    </div>
                    <div className="page-title">
                        <i onClick={() => { setSelectedTab('insert'); InsertOrUpdate === 'insert' ? setShowAlert(true) : setShowAlert(false) }} className={selectedTab === 'insert' ? 'active' : ''}>{InsertOrUpdate === 'insert' ? title : 'بروزرسانی کارت  صلاحیت'}</i>
                    </div>
                </div>
            </div>

            <div style={{ display: `${selectedTab === 'list' ? '' : 'none'}` }} className="row">
                <div className="col-12">
                    {ItemsList?.length > 0 &&
                        <DataGrid
                            clickOnRow={clickOnRowDataGrid}
                            pagesize={options[0].value}
                            items={ItemsList}
                            options={options}
                            thead={thead}
                        />
                    }
                    {ItemsList?.length <= 0 && <p style={{ marginTop: '40px' }}> {'موردی برای نمایش وجود ندارد'}</p>}
                </div>
            </div>


            <div style={{ display: `${selectedTab === 'insert' ? '' : 'none'}` }} className='aganceRegister-component'>

                {InsertOrUpdate === 'insert' && permit.CREATE === false && <p> <Page403 /></p>}
                {((InsertOrUpdate === 'insert' && permit.CREATE === true) || InsertOrUpdate === 'update') &&
                    <>
                        {InsertOrUpdate === 'update'
                            && <>
                                <button onClick={() => { clearFormInputs(); setInsertOrUpdate('insert') }} className='my-btn'>{title}</button>
                                <WordProcessor autoReadFile={true} wordFile={wordFile}
                                    fields={{ nat_num: fields?.driverNatNum }}
                                />
                            </>
                        }
                        <div className="row">

                            <div className="col-6">
                                <div className="form-group">
                                    <p>   شماره فیش واریزی </p>
                                    <input onChange={(e) => setFields({ ...fields, fishNumber: e.target.value })} value={fields?.fishNumber || ''} type="text" className="form-control" />
                                    {validateErrors?.fishNumber?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors?.fishNumber?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>   مبلغ (ریال)</p>
                                    <input onChange={(e) => setFields({ ...fields, fishPrice: e.target.value.replace(/,/g, '') })} value={fields?.fishPrice?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || ''} type="text" className="form-control" />
                                    {validateErrors?.fishPrice?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors?.fishPrice?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>   تاریخ فیش</p>
                                    <DatePicker
                                        onChange={(date) => handleChangeFishDate(date !== null ? (Array.isArray(date) ? date[0] : date) : null)}
                                        calendar={persian}
                                        locale={persian_fa}
                                        className="datetime-picker"
                                        inputClass="datetime-input !text-center !text-lg !p-4"
                                        value={fishDateDatePicker}
                                        placeholder={convertEnglishToPersianDigits(moment(new Date()).format('jYYYY/jMM/jDD'))}
                                    />

                                    {validateErrors?.fishDate?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors?.fishDate?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>


                            <div className="col-6">
                                <div className="form-group">
                                    <p>بارگزاری تصویر فیش   </p>
                                    <div className="file-upload-div">
                                        <FileUpload
                                            ref={fileUploadRef_fishPic}
                                            name={'fishPic'}
                                            id={objectId.toString()}
                                            handleGetBase64={handleGetBase64} />
                                        {fields?.attachFile?.fishPic &&
                                            <i className='fa fa-eye my-eye-icon' onClick={() => showAttachImage('fishPic')}></i>}
                                    </div>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="form-group">
                                    <p>   تصویر درخواست تمدید یا معرفی نامه محل فعالیت   </p>
                                    <div className="file-upload-div">
                                        <FileUpload
                                            ref={fileUploadRef_moarrefiNameMahaleFaaliyat}
                                            name={'moarrefiNameMahaleFaaliyat'}
                                            id={objectId.toString()}
                                            handleGetBase64={handleGetBase64} />
                                        {fields?.attachFile?.moarrefiNameMahaleFaaliyat &&
                                            <i className='fa fa-eye my-eye-icon' onClick={() => showAttachImage('moarrefiNameMahaleFaaliyat')}></i>}
                                    </div>
                                    {validateErrors?.attachFile?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors?.attachFile?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="form-group">
                                    <span>صدور کارت صلاحیت راننده به کد ملی </span>

                                    <select onChange={(e) => {
                                        const driver = aganceDriversList.filter((ite: any) => ite?.details?.nat_num === e.target.value && ite?.details?.nat_num !== null && ite?.details?.nat_num !== undefined)[0]
                                        setFields({
                                            ...fields, driverNatNum: e.target.value,
                                            shomareParvane: driver?.details?.shomareParvane,
                                            driverFullName: driver?.full_name,
                                            driverId: driver?._id,
                                        });
                                    }
                                    }
                                        className='form-control' value={fields?.driverNatNum as string || "1"}>
                                        <option value="1">---انتخاب کنید---</option>
                                        {aganceDriversList.map((driver: any) => {
                                            if (driver.status === 'ACTIVE') {
                                                return <option value={driver?.details?.nat_num}>{driver?.full_name}</option>
                                            }
                                        })}
                                    </select>
                                    و شماره پروانه
                                    <input onChange={(e) => setFields({ ...fields, shomareParvane: e.target.value })} value={fields?.shomareParvane || ''} type="text" className="form-control" />

                                    با اعتبار
                                    <input onChange={(e) => setFields({ ...fields, year: e.target.value })} value={fields?.year || ''} type="text" className="form-control" />

                                    از تاریخ
                                    <DatePicker
                                        onChange={(date) => handleChangeFromDate(date !== null ? (Array.isArray(date) ? date[0] : date) : null)}
                                        calendar={persian}
                                        locale={persian_fa}
                                        className="datetime-picker"
                                        inputClass="datetime-input !text-center !text-lg !p-4"
                                        value={fromDateDatePicker}
                                        placeholder=' تاریخ'
                                    />

                                    الی
                                    <DatePicker
                                        onChange={(date) => handleChangeToDate(date !== null ? (Array.isArray(date) ? date[0] : date) : null)}
                                        calendar={persian}
                                        locale={persian_fa}
                                        className="datetime-picker"
                                        inputClass="datetime-input !text-center !text-lg !p-4"
                                        value={toDateDatePicker}
                                        placeholder=' تاریخ'
                                    />
                                    بلامانع است.
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="form-group">
                                    <button disabled={Object.keys(validateErrors).length === 0 ? false : true}
                                        onClick={() => handleClick(InsertOrUpdate === 'insert' ? 'insert' : 'update')}
                                        className={`my-btn ${Object.keys(validateErrors).length === 0 ? '' : `my-btn-inactive`}`}>
                                        {InsertOrUpdate === 'insert' ? 'ثبت' : 'بروز رسانی'}</button>
                                    <button onClick={() => clearFormInputs()} className='my-btn'>انصراف</button>
                                </div>
                            </div>

                        </div>
                    </>
                }
            </div>
        </div>
    );
};

export default CardSalahiyat;;