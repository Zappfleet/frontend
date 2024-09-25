import React, { useEffect, useRef, useState } from 'react';
import './style.scss';
import ObjectId from 'bson-objectid';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import moment from 'jalali-moment';
import FileUpload, { FileUploadHandles } from '../../../components/FileUpload/FileUpload';
import useAganceRegister from '../../../hooks/data/Agance/useAganceRegister';
import { NotificationController } from '../../../lib/notificationController';
import DataGrid from '../../../components/DataGrid/DataGrid';
import { MdOutlinePlaylistAddCheckCircle } from 'react-icons/md';
import useSodureParvane from '../../../hooks/data/Agance/useSodureParvane';
import { convertEnglishToPersianDigits, convertGregorianToJalali, convertPersianToEnglishDigits, persianDateToGregorian } from '../../../utils/utils';
import { convertDateToISO, jalaliToIso } from '../../../utils/dateTools';
import useAuthentication from '../../../hooks/data/useAuthentication';
import * as permitConstant from '../../../lib/constants'
import Page403 from '../../../components/Page403/Page403';


const SodureParvane = ({ handleBackClick, title }: any) => {
    title = 'صدور و تمدید پروانه آژانس'
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
                if (permission === permitConstant.PERMIT_AGANCE_SODURE_PARVANE_CREATE) {
                    newPermit.CREATE = true
                }
                if (permission === permitConstant.PERMIT_AGANCE_SODURE_PARVANE_EDIT) {
                    newPermit.EDIT = true
                    thead_crud += '- update -'
                }
                if (permission === permitConstant.PERMIT_AGANCE_SODURE_PARVANE_DELETE) {
                    newPermit.DELETE = true
                    thead_crud += '- delete -'
                }
            })
        })
        setPermit(newPermit)
        setTheadCRUD(thead_crud)
    }, [authInfo])

    const fileUploadRef_fishPic = useRef<FileUploadHandles>(null);

    const clearFileUpload_fishPic = () => {
        if (fileUploadRef_fishPic.current) {
            fileUploadRef_fishPic.current.clearFileInput();
        }
    }

    interface SodureParvaneSchame {
        _id: string,
        id: string,
        fishNumber?: string,
        fishPrice?: string,
        fishDate?: string,
        year?: string,
        fromDate?: string,
        toDate?: string,
        aganceID?: string,
        attachFile?: {
            fishPic?: string;
        };
    }

    // Create a ref to store the ObjectId, ensuring it only gets generated once
    const objectIdRef = useRef(new ObjectId());

    // Extract the ObjectId from the ref
    const objectId = objectIdRef.current;




    const [showAttchImage, setShowAttchImage] = useState<any>(false)
    const [attchImageSrc, setAttchImageSrc] = useState<any>('')
    const [action_name, setActionName] = useState<any>('select')
    const [InsertOrUpdate, setInsertOrUpdate] = useState<any>('insert')
    const [selectedTab, setSelectedTab] = useState<any>('insert')
    const [fishDateDatePicker, setFishDateDatePicker] = useState<any>(moment(new Date()).format('jYYYY/jMM/jDD'));
    const [fishDate, setFishDate] = useState<any>(moment(new Date()).format('jYYYY/jMM/jDD'));
    const [fromDateDatePicker, setFromDateDatePicker] = useState<any>(moment(new Date()).format('jYYYY/jMM/jDD'));
    const [fromDate, setFromDate] = useState<any>(moment(new Date()).format('jYYYY/jMM/jDD'));
    const [toDateDatePicker, setToDateDatePicker] = useState<any>(moment(new Date()).format('jYYYY/jMM/jDD'));
    const [toDate, setToDate] = useState<any>(moment(new Date()).format('jYYYY/jMM/jDD'));

    const [showAlert, setShowAlert] = useState<any>(false)
    const [imagesBase64, setImagesBase64] = useState<any>({});
    const [fields, setFields] = useState<Partial<SodureParvaneSchame>>({
        fishDate: fishDate,
        fromDate: fromDate,
        toDate: toDate,
    });

    useEffect(() => {
        setFields({ ...fields, _id: objectId.toString() })
    }, [objectId])


    const options = [{ id: 1, value: 10 }, { id: 2, value: 30 }, { id: 3, value: 50 }]
    const thead = [
        // { key: 'id', name: 'شناسه' },
        { key: '', name: theadCRUD },
        { key: 'fishNumber', name: 'شماره فیش ', img: false },
        { key: 'fishPrice', name: 'مبلغ ' },
        { key: 'fishDate', name: 'تاریخ', type: 'caleadar', key2: 'fromdate' },
        { key: 'aganceName', name: 'نام آژانس' },
        { key: 'fromDate', name: ' تاریخ شروع ' },
        { key: 'toDate', name: 'تاریخ پایان' },
    ]
    const [ItemsList, setItemsList] = useState<any[]>([])
    const [OriginalItems, setOriginalItems] = useState<any[]>([])
    const [aganceList, setAganceList] = useState<any[]>([])

    const { result: resultAgance } = useAganceRegister('select', {})
    const { result, type: respType, state, refreshData } = useSodureParvane(action_name, fields)

    useEffect(() => {
        if (resultAgance?.status)
            setAganceList(resultAgance?.data?.data)
    }, [resultAgance])

    useEffect(() => {
        if (result) {
            switch (respType) {
                case 'insert':
                    if (result?.status === 200) {
                        NotificationController.showSuccess(' صدور پروانه ثبت شد')
                        setActionName('select')
                    }
                    else {
                        NotificationController.showError('صدور پروانه ثبت نشد')
                    }
                    break;
                case 'update':
                    if (result?.status === 200) {
                        NotificationController.showSuccess('صدور پروانه ویرایش شد')
                        setActionName('select')
                    }
                    else {
                        NotificationController.showError('صدور پروانه ویرایش نشد')
                    }
                    break;
                case 'delete':
                    if (result?.status === 200) {
                        NotificationController.showSuccess('صدور پروانه حذف شد')
                        setActionName('select')
                    }
                    else {
                        NotificationController.showError('صدور پروانه حذف نشد')
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

    useEffect(() => {

    }, [fishDate, fromDate, toDate])

    const customizeAndSetItems = (data: any) => {
        setItemsList(() => {
            return data.map((ite: any) => ({
                ...ite,
                aganceName: (aganceList?.filter((e: any) => e._id === ite?.aganceID))[0].name,
                fishDate: convertGregorianToJalali(ite.fishDate),
                fromDate: convertGregorianToJalali(ite.fromDate),
                toDate: convertGregorianToJalali(ite.toDate)
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

        clearFileUpload_fishPic()

        setShowAttchImage(false)
        setAttchImageSrc('')
        objectIdRef.current = new ObjectId();
        setFields({})
        setImagesBase64({})
        setActionName(null)
        setInsertOrUpdate('insert')
    }

    const handleChangefishDate = (date: any) => {
        setFishDateDatePicker(date);
        setFishDate(date.format('YYYY/MM/DD', { calendar: 'persian', locale: 'fa' }))
        setFields({ ...fields, fishDate: convertDateToISO(persianDateToGregorian(date.format('YYYY/MM/DD', { calendar: 'persian', locale: 'fa' }))) })
    }

    const handleChangefromDate = (date: any) => {
        setFromDateDatePicker(date);
        setFromDate(date.format('YYYY/MM/DD', { calendar: 'persian', locale: 'fa' }))
        setFields({ ...fields, fromDate: convertDateToISO(persianDateToGregorian(date.format('YYYY/MM/DD', { calendar: 'persian', locale: 'fa' }))) })
    }

    const handleChangetoDate = (date: any) => {
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

    const clickOnRowDataGrid = (item: SodureParvaneSchame, type: any) => {

        if (type === 'delete') {
            setFields(item)
            setActionName('delete')
        }
        if (type === 'update') {
            clearFileUpload_fishPic()
            const updateItem = (OriginalItems.filter((e: any) => e._id === item._id))[0]
            updateItem?.attachFile?.fishPic && fileUploadRef_fishPic.current?.setFileInput(item?.attachFile?.fishPic)

            setFishDateDatePicker(moment(updateItem.fishDate).format('jYYYY/jMM/jDD'));
            setFromDateDatePicker(moment(updateItem.fromDate).format('jYYYY/jMM/jDD'));
            setToDateDatePicker(moment(updateItem.toDate).format('jYYYY/jMM/jDD'));

            setFields(updateItem)
            setInsertOrUpdate('update')
        }
    }

    useEffect(() => {
        // console.log(556666,fie);

    }, [fields])

    const showAttachImage = (name: any) => {
        setAttchImageSrc(imagesBase64[name])
        setShowAttchImage(true)
    }

    return (

        <div className='agance-component'>
            {handleBackClick && <i className='fa fa-arrow-left back-icon' onClick={handleBackClick}></i>}



            {/* {showAlert && <div className="myalert">
                <div className="alert alert-info alert-dismissible">
                    <p>{`کاربر محترم ، افراد متقاضی دریافت پروانه آژانس باید حائز شرایط زیر باشند`}
                        <i className='far fa-grin-beam eimoji-icon'></i>
                    </p>
                    <p> {`متاهل یا دارای فرم کفالت و سرپرستی خانواده، بدون شغل و پروانه کسب`}</p>
                    <button className='my-btn' onClick={() => setShowAlert(false)}>متوجه شدم </button>
                </div>
            </div>
            } */}


            {showAttchImage && <div className="myAttachImage">
                <img className="upload-img" src={attchImageSrc} />
                <i className='fa fa-remove close-icon' onClick={() => setShowAttchImage(false)}></i>
            </div>}


            <div className="row">
                <div className="col-12">
                    {/* <div className="page-title">
                        <i onClick={() => { setSelectedTab('list'); setShowAlert(false) }} className={selectedTab === 'list' ? 'active' : ''}>{'لیست  صدور صلاحیت ها'}</i>
                    </div> */}
                    <div className="page-title">
                        <i onClick={() => { setSelectedTab('insert'); InsertOrUpdate === 'insert' ? setShowAlert(true) : setShowAlert(false) }} className={selectedTab === 'insert' ? 'active' : ''}>{InsertOrUpdate === 'insert' ? title : 'بروزرسانی آژانس'}</i>
                    </div>
                </div>
            </div>

            <div style={{ display: `${selectedTab === 'list' ? '' : 'none'}` }} className="row">
                <div className="col-12">
                    <DataGrid
                        clickOnRow={clickOnRowDataGrid}
                        pagesize={options[0].value}
                        items={ItemsList}
                        options={options}
                        thead={thead}
                    />
                </div>
            </div>


            <div style={{ display: `${selectedTab === 'insert' ? '' : 'none'}` }} className='aganceRegister-component'>
                {InsertOrUpdate === 'insert' && permit.CREATE === false && <p> <Page403 /></p>}
                {((InsertOrUpdate === 'insert' && permit.CREATE === true) || InsertOrUpdate === 'update') &&
                    <>
                        {InsertOrUpdate === 'update' && <button onClick={() => { clearFormInputs(); setInsertOrUpdate('insert') }} className='my-btn'>{title}</button>}
                        <div className="row">
                            <div className="col-6">
                                <div className="form-group">
                                    <p>شماره فیش واریزی </p>
                                    <input onChange={(e) => setFields({ ...fields, fishNumber: e.target.value })}
                                        value={fields?.fishNumber || ''} type="text" className="form-control" />
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p> مبلغ (ریال)</p>
                                    <input onChange={(e) => setFields({ ...fields, fishPrice: e.target.value.replace(/,/g, '') })}
                                        value={fields?.fishPrice?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || ''} type="text" className="form-control" />
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>تاریخ   </p>
                                    <DatePicker
                                        onChange={(date) => handleChangefishDate(date !== null ? (Array.isArray(date) ? date[0] : date) : null)}
                                        calendar={persian}
                                        locale={persian_fa}
                                        className="datetime-picker"
                                        inputClass="datetime-input !text-center !text-lg !p-4"
                                        value={fishDateDatePicker}
                                        placeholder='از تاریخ'
                                    />
                                </div>
                            </div>


                            <div className="col-6">
                                <div className="form-group">
                                    <p> تصویر فیش   </p>
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
                                    <span>صدور پروانه نمایندگی آژانس   </span>

                                    <select
                                        onChange={(e) => setFields({ ...fields, aganceID: e.target.value })}
                                        className='form-control' value={fields?.aganceID || '-1'}>
                                        {aganceList
                                            ?.filter((item: any) => item.status === '1') // فیلتر کردن آیتم‌هایی که مقدار status آنها 1 است
                                            .map((item: any) => {
                                                return <option value={item._id}>{item.name}</option>;
                                            })}
                                    </select>

                                    با اعتبار
                                    <input onChange={(e) => setFields({ ...fields, year: e.target.value })} value={fields?.year || ''} type="text" className="form-control" />

                                    از تاریخ
                                    <DatePicker
                                        onChange={(date) => handleChangefromDate(date !== null ? (Array.isArray(date) ? date[0] : date) : null)}
                                        calendar={persian}
                                        locale={persian_fa}
                                        className="datetime-picker"
                                        inputClass="datetime-input !text-center !text-lg !p-4"
                                        value={fromDateDatePicker}
                                        placeholder='از تاریخ'
                                    />
                                    الی
                                    <DatePicker
                                        onChange={(date) => handleChangetoDate(date !== null ? (Array.isArray(date) ? date[0] : date) : null)}
                                        calendar={persian}
                                        locale={persian_fa}
                                        className="datetime-picker"
                                        inputClass="datetime-input !text-center !text-lg !p-4"
                                        value={toDateDatePicker}
                                        placeholder='تا تاریخ'
                                    />
                                    بلامانع است.
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="form-group">
                                    <button onClick={() => handleClick(InsertOrUpdate === 'insert' ? 'insert' : 'update')} className='my-btn'>
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

export default SodureParvane;



















