import React, { useEffect, useRef, useState } from 'react';
import './style.scss';
import ObjectId from 'bson-objectid';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import moment from 'jalali-moment';
import FileUpload, { FileUploadHandles } from '../../../components/FileUpload/FileUpload';
import { NotificationController } from '../../../lib/notificationController';
import DataGrid from '../../../components/DataGrid/DataGrid';
import { convertGregorianToJalali, persianDateToGregorian } from '../../../utils/utils';
import { convertDateToISO } from '../../../utils/dateTools';
import useMoayeneFani from '../../../hooks/data/Agance/useMoayeneFani';
import { useValidateForm } from '../../../utils/validation';

import useAuthentication from '../../../hooks/data/useAuthentication';
import * as permitConstant from '../../../lib/constants'
import Page403 from '../../../components/Page403/Page403';
import ErrorBoundary from '../../../components/ErrorBoundary/ErrorBoundary';



interface MoayeneFani {
    _id: string,
    id: string,
    name?: string;
    StartActivityDate?: string;
    activityContext?: string;
    managerFullName?: string;
    managerCodeMelli?: string;
    address: {
        locations?: {
            coordinates: [number];
            wait: number;
            meta?: object;
        }[];
        address?: string;
        postalCode?: string;
    };
    managerPhone?: string;
    phone?: string;
    attachFile?: {
        modirPic?: string;
        parvaneNamayandegi?: string;
        mojavezSazmanHamlVaNaghl?: string;
    };
    status?: string;
    desc?: string;
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
        pattern: /^[0-9]{10}$/, // فقط 10 رقم
        showName: ''
    },
    "address.postalCode": {
        required: true,
        pattern: /^[0-9]{10}$/, // فقط 10 رقم
        showName: ''
    },
    "address.address": {
        required: true,
        showName: ''
    },
    phone: {
        required: true,
        pattern: /^[0-9]{11}$/, // فقط 11 رقم
        showName: ''
    },
    managerPhone: {
        required: true,
        pattern: /^[0-9]{11}$/, // فقط 11 رقم
        showName: ''
    },
    "attachFile.modirPic": {
        required: true,
        showName: ''
    },
    "attachFile.mojavezSazmanHamlVaNaghl": {
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
    activityContext: "1",
    StartActivityDate: moment(new Date()).format('jYYYY/jMM/jDD'),
    name: '',
    managerFullName: '',
    managerCodeMelli: '',
    address: { address: '', postalCode: '' },
    managerPhone: '',
    phone: '',
    attachFile: {
        modirPic: '',
        mojavezSazmanHamlVaNaghl: '',
    }
}
const RegisterMoayeneFani = ({ handleBackClick, title }: any) => {

    title = 'ثبت مرکز معاینه فنی'

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
                if (permission === permitConstant.PERMIT_AGANCE_MOAYENE_FANI_CREATE) {
                    newPermit.CREATE = true
                }
                if (permission === permitConstant.PERMIT_AGANCE_MOAYENE_FANI_EDIT) {
                    newPermit.EDIT = true
                    thead_crud += '- update -'
                }
                if (permission === permitConstant.PERMIT_AGANCE_MOAYENE_FANI_DELETE) {
                    newPermit.DELETE = true
                    thead_crud += '- delete -'
                }
            })
        })
        setPermit(newPermit)
        setTheadCRUD(thead_crud)
    }, [authInfo])

    const fileUploadRef_modirPic = useRef<FileUploadHandles>(null);
    const fileUploadRef_parvaneNamayandegi = useRef<FileUploadHandles>(null);
    const fileUploadRef_mojavezSazmanHamlVaNaghl = useRef<FileUploadHandles>(null);

    const clearFileUpload = (name: any) => {
        if (name.current) {
            name.current.clearFileInput();
        }
    }


    // Create a ref to store the ObjectId, ensuring it only gets generated once
    const objectIdRef = useRef(new ObjectId());
    // Extract the ObjectId from the ref
    const objectId = objectIdRef.current;

 

  


    const [showAttchImage, setShowAttchImage] = useState<any>(false)
    const [attchImageSrc, setAttchImageSrc] = useState<any>('')
    const [action_name, setActionName] = useState<any>('select')
    const [InsertOrUpdate, setInsertOrUpdate] = useState<any>('insert')
    const [selectedTab, setSelectedTab] = useState<any>('list')
    const [StartActivityDateDatePicker, setStartActivityDateDatePicker] = useState<any>(moment(new Date()).format('jYYYY/jMM/jDD'));
    const [StartActivityDate, setStartActivityDate] = useState<any>(moment(new Date()).format('jYYYY/jMM/jDD'));
    const [showAlert, setShowAlert] = useState<any>(false)
    const [imagesBase64, setImagesBase64] = useState<any>({});
    const [fields, setFields] = useState<Partial<MoayeneFani>>(initialValue);

    useEffect(() => {
        setFields({ ...fields, _id: InsertOrUpdate === 'insert' ? objectId?.toString() : fields?._id })
    }, [objectId,InsertOrUpdate])

    //validate
    const { errors: validateErrors, refreshData: validateRefreshData } = useValidateForm(validationRules, fields)
    useEffect(() => {
    }, [validateErrors])

    const options = [{ id: 1, value: 10 }, { id: 2, value: 30 }, { id: 3, value: 50 }]
    const thead = [
        // { key: 'id', name: 'شناسه' },
        { key: '', name: theadCRUD },
        { key: 'name', name: 'نام مرکز', img: false },
        { key: 'activityContext', name: 'زمینه فعالیت' },
        { key: 'StartActivityDate', name: ' تاریخ شروع  فعالیت', type: 'caleadar', key2: 'fromdate' },
        { key: 'managerFullName', name: 'مدیر' },
    ]

    const [ItemsList, setItemsList] = useState<any[]>([])
    const [OriginalItems, setOriginalItems] = useState<any[]>([])

    const { result, type: respType, state, refreshData } = useMoayeneFani(action_name, fields)

    useEffect(() => {
        if (result) {
            switch (respType) {
                case 'insert':
                    if (result?.status === 200) {
                        NotificationController.showSuccess('مرکز معاینه فنی ثبت شد')
                        setActionName('select')
                    }
                    else {
                        NotificationController.showError('مرکز معاینه فنی ثبت نشد')
                    }
                    break;
                case 'update':
                    if (result?.status === 200) {
                        NotificationController.showSuccess('مرکز معاینه فنی ویرایش شد')
                        setActionName('select')
                    }
                    else {
                        NotificationController.showError('مرکز معاینه فنی ویرایش نشد')
                    }
                    break;
                case 'delete':
                    if (result?.status === 200) {
                        NotificationController.showSuccess('مرکز معاینه فنی حذف شد')
                        setActionName('select')
                    }
                    else {
                        NotificationController.showError('مرکز معاینه فنی حذف نشد')
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
    const clearAllUplodedFile = () => {
        clearFileUpload('modirPic')
        clearFileUpload('parvaneNamayandegi')
        clearFileUpload('mojavezSazmanHamlVaNaghl')
    }

    const clearFormInputs = () => {

        setStartActivityDateDatePicker(moment(new Date()).format('jYYYY/jMM/jDD'));
        setStartActivityDate(moment(new Date()).format('jYYYY/jMM/jDD'));

        clearAllUplodedFile()

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

    const clickOnRowDataGrid = (item: MoayeneFani, type: any) => {

        if (type === 'delete') {
            setFields(item)
            setActionName('delete')
        }
        if (type === 'update') {

            clearAllUplodedFile()

            const updateItem: MoayeneFani = (OriginalItems.filter((e: any) => e._id === item._id))[0]

            updateItem?.attachFile?.modirPic && fileUploadRef_modirPic.current?.setFileInput(updateItem?.attachFile?.modirPic)
            updateItem?.attachFile?.mojavezSazmanHamlVaNaghl && fileUploadRef_mojavezSazmanHamlVaNaghl.current?.setFileInput(updateItem?.attachFile?.mojavezSazmanHamlVaNaghl)
            updateItem?.attachFile?.parvaneNamayandegi && fileUploadRef_parvaneNamayandegi.current?.setFileInput(updateItem?.attachFile?.parvaneNamayandegi)

            setStartActivityDateDatePicker(moment(updateItem.StartActivityDate).format('jYYYY/jMM/jDD'));

            setFields(updateItem)
            setInsertOrUpdate('update')
        }
    }

    useEffect(() => {
    }, [fields])

    const showAttachImage = (name: any) => {
        setAttchImageSrc(imagesBase64[name])
        setShowAttchImage(true)
    }

    return (

        <div className='agance-component RegisterMoayeneFani-component'>
            {handleBackClick && <i className='fa fa-arrow-left back-icon' onClick={handleBackClick}></i>}

            {showAttchImage && <div className="myAttachImage">
                <img className="upload-img" src={attchImageSrc} />
                <i className='fa fa-remove close-icon' onClick={() => setShowAttchImage(false)}></i>
            </div>}


            <div className="row">
                <div className="col-12">
                    <div className="page-title">
                        <i onClick={() => { setSelectedTab('list'); setShowAlert(false) }} className={selectedTab === 'list' ? 'active' : ''}>{'لیست مرکز معاینه فنی ها'}</i>
                    </div>
                    <div className="page-title">
                        <i onClick={() => { setSelectedTab('insert'); InsertOrUpdate === 'insert' ? setShowAlert(true) : setShowAlert(false) }} className={selectedTab === 'insert' ? 'active' : ''}>{InsertOrUpdate === 'insert' ? title : 'بروزرسانی مرکز معاینه فنی'}</i>
                    </div>
                </div>
            </div>

            <div style={{ display: `${selectedTab === 'list' ? '' : 'none'}` }} className="row">
                <div className="col-12">
                    {ItemsList?.length <= 0 && <p style={{ marginTop: '40px' }}> {'موردی برای نمایش وجود ندارد'}</p>}
                    {ItemsList?.length > 0 &&

                        <DataGrid
                            clickOnRow={clickOnRowDataGrid}
                            pagesize={options[0].value}
                            items={ItemsList}
                            options={options}
                            thead={thead}
                        />

                    }
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
                                    <p>نام مرکز معاینه فنی</p>
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
                                        placeholder=' تاریخ'
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
                                    <p> زمینه فعالیت (سبک ، سنگین ، سبک و سنگین)  </p>
                                    <select onChange={(e) => setFields({ ...fields, activityContext: e.target.value })}
                                        className='form-control' value={fields?.activityContext as string || "خودرو سبک"}>
                                        <option value="خودرو سبک">خودرو سبک</option>
                                        <option value="خودرو سنگین">خودرو سنگین</option>
                                        <option value="خودرو سبک و سنگین">خودرو سبک و سنگین</option>
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
                                    <p>بارگزاری تصویر پروانه مرکز  </p>
                                    <div className="file-upload-div">

                                        <FileUpload
                                            ref={fileUploadRef_parvaneNamayandegi}
                                            name={'parvaneNamayandegi'}
                                            id={fields?._id || ''}
                                            handleGetBase64={handleGetBase64} />


                                        {fields?.attachFile?.parvaneNamayandegi &&
                                            <i className='fa fa-eye my-eye-icon' onClick={() => showAttachImage('parvaneNamayandegi')}></i>}
                                    </div>
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p> تصویر مدیر مرکز   </p>
                                    <div className="file-upload-div">

                                        <FileUpload
                                            ref={fileUploadRef_modirPic}
                                            name={'modirPic'} id={fields?._id || ''} handleGetBase64={handleGetBase64} />


                                        {fields?.attachFile?.modirPic && <i className='fa fa-eye my-eye-icon' onClick={() => showAttachImage('modirPic')}></i>}
                                    </div>
                                    {validateErrors['attachFile.modirPic']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['attachFile.modirPic']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p> تصویر مجوز  اتحادیه سازمان های حمل و نقل </p>
                                    <div className="file-upload-div">

                                        <FileUpload
                                            ref={fileUploadRef_mojavezSazmanHamlVaNaghl}
                                            name={'mojavezSazmanHamlVaNaghl'} id={fields?._id || ''} handleGetBase64={handleGetBase64} />

                                        {fields?.attachFile?.mojavezSazmanHamlVaNaghl && <i className='fa fa-eye my-eye-icon' onClick={() => showAttachImage('mojavezSazmanHamlVaNaghl')}></i>}
                                    </div>
                                    {validateErrors['attachFile.mojavezSazmanHamlVaNaghl']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['attachFile.mojavezSazmanHamlVaNaghl']?.map((error: any) => { return <p>{error}</p> })} </div>
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

export default RegisterMoayeneFani;

