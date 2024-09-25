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
import { convertGregorianToJalali, persianDateToGregorian } from '../../../utils/utils';
import { convertDateToISO } from '../../../utils/dateTools';
import { useValidateForm } from '../../../utils/validation';
import useAuthentication from '../../../hooks/data/useAuthentication';
import * as permitConstant from '../../../lib/constants'
import Page403 from '../../../components/Page403/Page403';

interface Agance {
    _id: string,
    id: string,
    address: {
        locations?: {
            coordinates: [number];
            wait: number;
            meta?: object;
        }[];
        address?: string;
        postalCode?: string;
    };
    desc?: string;
    attachFile?: {
        modirOrmobasherPic?: string;
        parvaneNamayandegi?: string;
        amaken?: string;
        estelamat3Gane?: string;
    };
    status?: string;
    managerPhone?: string;
    phone?: string;
    mobasherCodeMelli?: string;
    mobasherFullName?: string;
    managerCodeMelli?: string;
    managerFullName?: string;
    StartActivityDate?: string;
    name?: string;
    activityContext?: string;
    submitted_by?: string; // Assuming ObjectId is represented as string in frontend
}

const validationRules: any = {
    name: {
        required: true,
        showName: ''
    },
    StartActivityDate: {
        required: true,
        showName: ''
    },
    activityContext: {
        required: true,
        showName: ''
    },
    managerFullName: {
        required: true,
        showName: ''
    },
    managerCodeMelli: {
        required: true,
        showName: ''
    },
    "address.postalCode": {
        required: true,
        showName: ''
    },
    "address.address": {
        required: true,
        showName: ''
    },
    phone: {
        required: true,
        showName: ''
    },
    managerPhone: {
        required: true,
        showName: ''
    },
    "attachFile.modirOrmobasherPic": {
        required: true,
        showName: ''
    },
    "attachFile.amaken": {
        required: true,
        showName: ''
    },
    "attachFile.estelamat3Gane": {
        required: true,
        showName: ''
    },
    status: {
        required: true,
        showName: ''
    }
};

const initialValue: any = {
    status: "1",
    activityContext: "بار",
    StartActivityDate: '',// moment(new Date()).format('jYYYY/jMM/jDD'),
    name: '',
    managerFullName: '',
    managerCodeMelli: '',
    address: { address: '', postalCode: '' },
    managerPhone: '',
    phone: '',
    attachFile: {
        modirOrmobasherPic: '',
        amaken: '',
        estelamat3Gane: ''
    }
}

const AganceRegister = ({ handleBackClick, title }: any) => {

    title = 'ثبت آژانس'

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
                if (permission === permitConstant.PERMIT_AGANCE_AGANCE_CREATE) {
                    newPermit.CREATE = true
                }
                if (permission === permitConstant.PERMIT_AGANCE_AGANCE_EDIT) {
                    newPermit.EDIT = true
                    thead_crud += '- update -'
                }
                if (permission === permitConstant.PERMIT_AGANCE_AGANCE_DELETE) {
                    newPermit.DELETE = true
                    thead_crud += '- delete -'
                }
            })
        })
        setPermit(newPermit)
        setTheadCRUD(thead_crud)
    }, [authInfo])

    const fileUploadRef_modirOrmobasherPic = useRef<FileUploadHandles>(null);
    const fileUploadRef_parvaneNamayandegi = useRef<FileUploadHandles>(null);
    const fileUploadRef_amaken = useRef<FileUploadHandles>(null);
    const fileUploadRef_estelamat3Gane = useRef<FileUploadHandles>(null);


    const clearFileUpload_modirOrmobasherPic = () => {
        if (fileUploadRef_modirOrmobasherPic.current) {
            fileUploadRef_modirOrmobasherPic.current.clearFileInput();
        }
    }

    const clearFileUpload_parvaneNamayandegi = () => {
        if (fileUploadRef_parvaneNamayandegi.current) {
            fileUploadRef_parvaneNamayandegi.current.clearFileInput();
        }
    }

    const clearFileUpload_amaken = () => {
        if (fileUploadRef_amaken.current) {
            fileUploadRef_amaken.current.clearFileInput();
        }
    }

    const clearFileUpload_estelamat3Gane = () => {
        if (fileUploadRef_estelamat3Gane.current) {
            fileUploadRef_estelamat3Gane.current.clearFileInput();
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
    const [StartActivityDateDatePicker, setStartActivityDateDatePicker] = useState<any>(null)//moment(new Date()).format('jYYYY/jMM/jDD'));
    const [StartActivityDate, setStartActivityDate] = useState<any>(null)//moment(new Date()).format('jYYYY/jMM/jDD'));
    const [showAlert, setShowAlert] = useState<any>(false)
    const [imagesBase64, setImagesBase64] = useState<any>({});
    const [fields, setFields] = useState<Partial<Agance>>(initialValue);

    //validate
    const { errors: validateErrors, refreshData: validateRefreshData } = useValidateForm(validationRules, fields)
    useEffect(() => {
        console.log(100, Object.keys(validateErrors).length);

    }, [validateErrors])


    const options = [{ id: 1, value: 10 }, { id: 2, value: 30 }, { id: 3, value: 50 }]
    const thead = [
        // { key: 'id', name: 'شناسه' },
        { key: '', name: theadCRUD },
        { key: 'name', name: 'نام آژانس', img: false },
        { key: 'activityContext', name: 'زمینه فعالیت' },
        { key: 'StartActivityDate', name: ' تاریخ شروع  فعالیت', type: 'caleadar', key2: 'fromdate' },
        { key: 'managerFullName', name: 'مدیر' },
    ]

    const [ItemsList, setItemsList] = useState<any[]>([])
    const [OriginalItems, setOriginalItems] = useState<any[]>([])

    const { result, type: respType, state, refreshData } = useAganceRegister(action_name, fields)

    useEffect(() => {
        if (result) {
            switch (respType) {
                case 'insert':
                    if (result?.status === 200) {
                        NotificationController.showSuccess('آژانس ثبت شد')
                        setActionName('select')
                    }
                    else {
                        NotificationController.showError('آژانس ثبت نشد')
                    }
                    break;
                case 'update':
                    if (result?.status === 200) {
                        NotificationController.showSuccess('آژانس ویرایش شد')
                        setActionName('select')
                    }
                    else {
                        NotificationController.showError('آژانس ویرایش نشد')
                    }
                    break;
                case 'delete':
                    if (result?.status === 200) {
                        NotificationController.showSuccess('آژانس حذف شد')
                        setActionName('select')
                    }
                    else {
                        NotificationController.showError('آژانس حذف نشد')
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
                StartActivityDate: convertGregorianToJalali(ite.StartActivityDate),
            }));
        });

        // data?.map((item: any) => {
        //     console.log(421, convertGregorianToJalali('2024-07-21T09:58:06.688+00:00'));

        // })
    }
    const clearFormInputs = () => {

        setStartActivityDateDatePicker(null)//moment(new Date()).format('jYYYY/jMM/jDD'));
        setStartActivityDate(null)//moment(new Date()).format('jYYYY/jMM/jDD'));

        clearFileUpload_amaken()
        clearFileUpload_estelamat3Gane()
        clearFileUpload_modirOrmobasherPic()
        clearFileUpload_parvaneNamayandegi()
        setShowAttchImage(false)
        setAttchImageSrc('')
        objectIdRef.current = new ObjectId();
        setFields(initialValue)
        setImagesBase64({})
        setActionName(null)
        setInsertOrUpdate('insert')
    }

    const handleChangeStartActivityDate = (date: any) => {
        setStartActivityDateDatePicker(date);
        setStartActivityDate(date.format('YYYY/MM/DD', { calendar: 'persian', locale: 'fa' }))
        setFields({ ...fields, StartActivityDate: convertDateToISO(persianDateToGregorian(date.format('YYYY/MM/DD', { calendar: 'persian', locale: 'fa' }))) })
    }

    useEffect(() => {
        // console.log(4576, imagesBase64);

    }, [imagesBase64])

    const handleGetBase64 = (base64: any, fieldName: any, fieldValue: any, isRef: boolean) => {

        setImagesBase64((prevImagesBase64: any) => ({
            ...prevImagesBase64,
            [fieldName]: base64
        }))

        if (isRef === false) {
            setFields((prevFields) => ({
                ...prevFields,
                attachFile: {
                    ...prevFields.attachFile,
                    [fieldName]: fieldValue
                }
            }));
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

    const clickOnRowDataGrid = (item: Agance, type: any) => {

        if (type === 'delete') {
            setFields(item)
            setActionName('delete')
        }
        if (type === 'update') {

            clearFileUpload_amaken()
            clearFileUpload_estelamat3Gane()
            clearFileUpload_modirOrmobasherPic()
            clearFileUpload_parvaneNamayandegi()

            const updateItem = (OriginalItems.filter((e: any) => e._id === item._id))[0]

            updateItem?.attachFile?.modirOrmobasherPic && fileUploadRef_modirOrmobasherPic.current?.setFileInput(updateItem?.attachFile?.modirOrmobasherPic)
            updateItem?.attachFile?.amaken && fileUploadRef_amaken.current?.setFileInput(updateItem?.attachFile?.amaken)
            updateItem?.attachFile?.estelamat3Gane && fileUploadRef_estelamat3Gane.current?.setFileInput(updateItem?.attachFile?.estelamat3Gane)
            updateItem?.attachFile?.parvaneNamayandegi && fileUploadRef_parvaneNamayandegi.current?.setFileInput(updateItem?.attachFile?.parvaneNamayandegi)


            console.log(65689, updateItem.StartActivityDate);

            setStartActivityDateDatePicker(moment(updateItem.StartActivityDate).format('jYYYY/jMM/jDD'));

            setFields(updateItem)
            setInsertOrUpdate('update')
        }
    }

    useEffect(() => {
    }, [fields])

    const showAttachImage = (name: any) => {
        console.log(200, name);
        setAttchImageSrc(imagesBase64[name])
        setShowAttchImage(true)
    }

    return (

        <div className='agance-component'>
            {handleBackClick && <i className='fa fa-arrow-left back-icon' onClick={handleBackClick}></i>}

            {showAlert && permit.CREATE === true && <div className="myalert">
                <div className="alert alert-info alert-dismissible">
                    {/* <i className='fa fa-remove close-icon' onClick={() => setShowAlert(false)}></i> */}
                    <p>{`کاربر محترم ، افراد متقاضی دریافت پروانه آژانس باید حائز شرایط زیر باشند`}
                        <i className='far fa-grin-beam eimoji-icon'></i>
                    </p>
                    <p> {`متاهل یا دارای فرم کفالت و سرپرستی خانواده، بدون شغل و پروانه کسب`}</p>
                    <button className='my-btn' onClick={() => setShowAlert(false)}>متوجه شدم </button>
                </div>
            </div>
            }
            {showAttchImage && <div className="myAttachImage">
                <img className="upload-img" src={attchImageSrc} />
                <i className='fa fa-remove close-icon' onClick={() => setShowAttchImage(false)}></i>
            </div>}


            <div className="row">
                <div className="col-12">
                    <div className="page-title">
                        <i onClick={() => { setSelectedTab('list'); setShowAlert(false) }} className={selectedTab === 'list' ? 'active' : ''}>{'لیست آژانس ها'}</i>
                    </div>
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
                                    <p>نام آژانس</p>
                                    <input onChange={(e) => setFields({ ...fields, name: e.target.value })} value={fields?.name || ''} type="text" className="form-control" />
                                    {validateErrors?.name?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors?.name?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>تاریخ شروع فعالیت </p>
                                    <DatePicker
                                        onChange={(date) => handleChangeStartActivityDate(date !== null ? (Array.isArray(date) ? date[0] : date) : null)}
                                        calendar={persian}
                                        locale={persian_fa}
                                        className="datetime-picker"
                                        inputClass="datetime-input !text-center !text-lg !p-4"
                                        value={StartActivityDateDatePicker}
                                        placeholder='از تاریخ'
                                    />
                                    {validateErrors?.StartActivityDate?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors?.StartActivityDate?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p> زمینه فعالیت (بار ، مسافر)  </p>
                                    <select onChange={(e) => setFields({ ...fields, activityContext: e.target.value })}
                                        className='form-control' value={fields?.activityContext as string || "بار"}>
                                        <option value="بار">بار</option>
                                        <option value="مسافر">مسافر</option>
                                    </select>
                                    {validateErrors?.activityContext?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors?.activityContext?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>نام و نام خانوادگی مدیر  </p>
                                    <input
                                        onChange={(e) => setFields({ ...fields, managerFullName: e.target.value })}
                                        value={fields?.managerFullName || ''}
                                        type="text" className="form-control" />
                                    {validateErrors?.managerFullName?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors?.managerFullName?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p> کد ملی مدیر </p>
                                    <input
                                        onChange={(e) => setFields({ ...fields, managerCodeMelli: e.target.value })}
                                        value={fields?.managerCodeMelli || ''}
                                        type="text" className="form-control" />
                                    {validateErrors?.managerCodeMelli?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors?.managerCodeMelli?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p> نام و نام خانوادگی مباشر </p>
                                    <input
                                        onChange={(e) => setFields({ ...fields, mobasherFullName: e.target.value })}
                                        value={fields?.mobasherFullName || ''}
                                        type="text" className="form-control" />
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p> کد ملی مباشر </p>
                                    <input
                                        onChange={(e) => setFields({ ...fields, mobasherCodeMelli: e.target.value })}
                                        value={fields?.mobasherCodeMelli || ''}
                                        type="text" className="form-control" />
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p> آدرس و موقعیت مکانی </p>
                                    <input
                                        onChange={(e) => setFields({ ...fields, address: { ...fields.address, address: e.target.value } })}
                                        value={fields?.address?.address || ''}
                                        type="text" className="form-control" />
                                    {validateErrors['address.address']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['address.address']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p> کد پستی </p>
                                    <input
                                        onChange={(e) => setFields({ ...fields, address: { ...fields.address, postalCode: e.target.value } })}
                                        value={fields?.address?.postalCode || ''}
                                        type="text" className="form-control" />
                                    {validateErrors['address.postalCode']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['address.postalCode']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p> تلفن ثابت </p>
                                    <input
                                        onChange={(e) => setFields({ ...fields, phone: e.target.value })}
                                        value={fields?.phone || ''}
                                        type="text" className="form-control" />
                                    {validateErrors?.phone?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors?.phone?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p> تلفن همراه مدیر </p>
                                    <input
                                        onChange={(e) => setFields({ ...fields, managerPhone: e.target.value })}
                                        value={fields?.managerPhone || ''}
                                        type="text" className="form-control" />
                                    {validateErrors?.managerPhone?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors?.managerPhone?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>بارگزاری تصویر پروانه نمایندگی  </p>
                                    <div className="file-upload-div">
                                        <FileUpload
                                            ref={fileUploadRef_parvaneNamayandegi}
                                            name={'parvaneNamayandegi'}
                                            id={objectId.toString()}
                                            handleGetBase64={handleGetBase64} />

                                        {fields?.attachFile?.parvaneNamayandegi &&
                                            <i className='fa fa-eye my-eye-icon' onClick={() => showAttachImage('parvaneNamayandegi')}></i>}

                                    </div>

                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p> تصویر مدیر یا مباشر آژانس </p>
                                    <div className="file-upload-div">
                                        <FileUpload
                                            ref={fileUploadRef_modirOrmobasherPic}
                                            name={'modirOrmobasherPic'} id={objectId.toString()} handleGetBase64={handleGetBase64} />
                                        {fields?.attachFile?.modirOrmobasherPic && <i className='fa fa-eye my-eye-icon' onClick={() => showAttachImage('modirOrmobasherPic')}></i>}
                                    </div>
                                    {validateErrors['attachFile.modirOrmobasherPic']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['attachFile.modirOrmobasherPic']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p> تصویر مجوز اداره اماکن </p>
                                    <div className="file-upload-div">
                                        <FileUpload
                                            ref={fileUploadRef_amaken}
                                            name={'amaken'} id={objectId.toString()} handleGetBase64={handleGetBase64} />
                                        {fields?.attachFile?.amaken && <i className='fa fa-eye my-eye-icon' onClick={() => showAttachImage('amaken')}></i>}
                                    </div>
                                    {validateErrors['attachFile.amaken']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['attachFile.amaken']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p> بارگزاری استعلامات 3 گانه و فرم تعهد قوانین حمل و نقل </p>
                                    <div className="file-upload-div">
                                        <FileUpload
                                            ref={fileUploadRef_estelamat3Gane}
                                            name={'estelamat3Gane'} id={objectId.toString()} handleGetBase64={handleGetBase64} />
                                        {fields?.attachFile?.estelamat3Gane && <i className='fa fa-eye my-eye-icon' onClick={() => showAttachImage('estelamat3Gane')}></i>}
                                    </div>
                                    {validateErrors['attachFile.estelamat3Gane']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['attachFile.estelamat3Gane']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p> وضعیت </p>
                                    <select
                                        onChange={(e) => setFields({ ...fields, status: e.target.value })}
                                        className='form-control' value={fields.status || '1'}>
                                        <option value="1">فعال</option>
                                        <option value="2">غیر فعال</option>
                                    </select>
                                    {validateErrors?.status?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors?.status?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="form-group">
                                    <p> توضیحات </p>
                                    <textarea
                                        onChange={(e) => setFields({ ...fields, desc: e.target.value })}
                                        value={fields?.desc || ''}
                                        rows={5} className="form-control" />
                                </div>
                            </div>


                            <div className="col-12">
                                <div className="form-group">
                                    <button onClick={() => handleClick(InsertOrUpdate === 'insert' ? 'insert' : 'update')}
                                        className={`my-btn ${Object.keys(validateErrors).length === 0 ? '' : 'my-btn-inactive'}`}
                                    >
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

export default AganceRegister;