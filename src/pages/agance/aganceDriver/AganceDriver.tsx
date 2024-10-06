import React, { useEffect, useRef, useState } from 'react';
import '../aganceRegister/style.scss';
import './style.scss'
import ObjectId from 'bson-objectid';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import moment from 'jalali-moment';
import FileUpload, { FileUploadHandles } from '../../../components/FileUpload/FileUpload';
import { NotificationController } from '../../../lib/notificationController';
import DataGrid from '../../../components/DataGrid/DataGrid';
import { persianDateToGregorian } from '../../../utils/utils';
import { convertDateToISO } from '../../../utils/dateTools';
import AganceVehicle from '../aganceVehicle/AganceVehicle';
import useAganceDriver from '../../../hooks/data/Agance/useAganceDriver';
import Print from '../../../components/Exports/print/Print';
import Excel from '../../../components/Exports/excel/Excel';
import Pdf from '../../../components/Exports/pdf/pdf';
import Word from '../../../components/Exports/word/word';
import { useValidateForm } from '../../../utils/validation';
import Page403 from '../../../components/Page403/Page403';
import useAuthentication from '../../../hooks/data/useAuthentication';
import * as permitConstant from '../../../lib/constants'
import ErrorBoundary from '../../../components/ErrorBoundary/ErrorBoundary';


interface Driver {
    _id: string,
    id: string,
    username?: string,
    password?: string,
    full_name?: string,
    phone?: string,
    reg_key?: string,
    roles?: string[],
    status?: string,
    details?: {
        shomareParvane?: number,
        name?: string,
        family?: string;
        fatherName?: string,
        nikName?: string,
        nat_num?: string,
        homePhone?: string,
        shomare_shenasname?: string,
        birthDate?: string,
        sadere?: string,
        activityContext?: string[],
        gender?: string,
        address?: string,
        postalCode?: string,
        cellPhone?: string,
        madrakeTahsili?: string,
        reshteTahsili?: string,
        taahol?: string,
        din?: string,
        shomareKartePayanKhedmat?: string,
        bimeStatus?: string,
        shomareBime?: string,
        shomareFish?: string,
        fishDate?: string,
        fishPrice?: string
        attachFile?: {
            cartMelli?: string;
            shenasname?: string;
            payanekhedmat?: string;
            rooyeGovahiname?: string;
            poshteGovahiname?: string;
            driverPic?: string;
            estelameGovahiname?: string;
            tashkhisHoviyat?: string;
            markazeBehdasht?: string;
            mojavezeAmaken?: string;
        },
        step?: number
    }
}

const validationRules: any = {
    "details.name": {
        required: true,
        showName: ''
    },
    "details.family": {
        required: true,
        showName: ''
    },
    "details.fatherName": {
        required: true,
        showName: ''
    },
    "details.nat_num": {
        required: true,
        pattern: /^[0-9]{10}$/, // فقط 10 رقم
        showName: ''
    },
    "details.shomare_shenasname": {
        required: true,
        showName: ''
    },
    "details.birthDate": {
        required: true,
        showName: ''
    },
    "details.sadere": {
        required: true,
        showName: ''
    },
    "details.activityContext": {
        required: true,
        showName: ''
    },
    "details.gender": {
        required: true,
        showName: ''
    },
    "details.address": {
        required: true,
        showName: ''
    },
    // "attachFile.mojavezeAmaken": {
    //     required: true,
    //     showName: ''
    // },
    "details.postalCode": {
        required: true,
        pattern: /^[0-9]{10}$/, // فقط 10 رقم
        showName: ''
    }
    ,
    "details.homePhone": {
        required: true,
        pattern: /^[0-9]{11}$/, // فقط 11 رقم
        showName: ''
    }
    ,
    phone: {
        required: true,
        pattern: /^[0-9]{11}$/, // فقط 11 رقم
        showName: ''
    },
    "details.madrakeTahsili": {
        required: true,
        showName: ''
    },
    "details.taahol": {
        required: true,
        showName: ''
    },
    "details.din": {
        required: true,
        showName: ''
    },
    "details.attachFile.cartMelli": {
        required: true,
        showName: ''
    },
    "details.attachFile.shenasname": {
        required: true,
        showName: ''
    },
    "details.attachFile.payanekhedmat": {
        required: true,
        showName: ''
    },
    "details.attachFile.rooyeGovahiname": {
        required: true,
        showName: ''
    },
    "details.attachFile.poshteGovahiname": {
        required: true,
        showName: ''
    },
    "details.attachFile.driverPic": {
        required: true,
        showName: ''
    },
    "details.shomareFish": {
        required: true,
        showName: ''
    },
    "details.fishDate": {
        required: true,
        showName: ''
    },
    "details.fishPrice": {
        required: true,
        showName: ''
    },
    "details.attachFile.mojavezeAmaken": {
        required: true,
        showName: ''
    },
    "details.attachFile.estelameGovahiname": {
        required: true,
        showName: ''
    },
    "details.attachFile.tashkhisHoviyat": {
        required: true,
        showName: ''
    },
    "details.attachFile.markazeBehdasht": {
        required: true,
        showName: ''
    }
};

const initialValue: any = {
    details: {
        name: '',
        family: '',
        fatherName: '',
        nat_num: '',
        shomare_shenasname: '',
        sadere: '',
        birthDate: '',// convertEnglishToPersianDigits(moment(new Date()).format('jYYYY/jMM/jDD')),
        bimeStatus: 'ندارد',
        activityContext: undefined,
        gender: 'مرد',
        address: '',
        postalCode: '',
        cellPhone: '',
        madrakeTahsili: '',
        taahol: 'مجرد',
        din: '',
        attachFile: {
            cartMelli: '',
            shenasname: '',
            payanekhedmat: '',
            rooyeGovahiname: '',
            poshteGovahiname: '',
            driverPic: '',
            estelameGovahiname: '',
            tashkhisHoviyat: '',
            markazeBehdasht: '',
            mojavezeAmaken: '',
        },
        shomareFish: '',
        fishDate: '',// convertEnglishToPersianDigits(moment(new Date()).format('jYYYY/jMM/jDD')),
        fishPrice: '',

    },
    phone: '',
}
const AganceDriver = ({ handleBackClick, title }: any) => {

    title = 'ثبت راننده'

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
                if (permission === permitConstant.PERMIT_AGANCE_DRIVER_CREATE) {
                    newPermit.CREATE = true
                }
                if (permission === permitConstant.PERMIT_AGANCE_DRIVER_EDIT) {
                    newPermit.EDIT = true
                    thead_crud += '- update -'
                }
                if (permission === permitConstant.PERMIT_AGANCE_DRIVER_DELETE) {
                    newPermit.DELETE = true
                    thead_crud += '- delete -'
                }
            })
        })
        setPermit(newPermit)
        setTheadCRUD(thead_crud)
    }, [authInfo])

    const [step, SteStep] = useState<any>(1)
    const [realStep, SteRealStep] = useState<any>(1)
    const [isPermitForApprove, setIsPermitForApprove] = useState<boolean>(true)
    const [reftreshVehicle, setreftreshVehicle] = useState<boolean>(false)


    const activityContextOptions: string[] = ['سرویس مدارس', 'آژانس', 'خطوط', 'وانت بار']

    const fileUploadRef_cartMelli = useRef<FileUploadHandles>(null);
    const fileUploadRef_shenasname = useRef<FileUploadHandles>(null);
    const fileUploadRef_payanekhedmat = useRef<FileUploadHandles>(null);
    const fileUploadRef_rooyeGovahiname = useRef<FileUploadHandles>(null);
    const fileUploadRef_poshteGovahiname = useRef<FileUploadHandles>(null);
    const fileUploadRef_driverPic = useRef<FileUploadHandles>(null);
    const fileUploadRef_estelameGovahiname = useRef<FileUploadHandles>(null);
    const fileUploadRef_tashkhisHoviyat = useRef<FileUploadHandles>(null);
    const fileUploadRef_markazeBehdasht = useRef<FileUploadHandles>(null);
    const fileUploadRef_mojavezeAmaken = useRef<FileUploadHandles>(null);
    const fileUploadRef_rooyeCartKhodro = useRef<FileUploadHandles>(null);
    const fileUploadRef_poshtCartKhodro = useRef<FileUploadHandles>(null);
    const fileUploadRef_bargeSabz = useRef<FileUploadHandles>(null);
    const fileUploadRef_bime = useRef<FileUploadHandles>(null);
    const fileUploadRef_moayeneFanni = useRef<FileUploadHandles>(null);


    const clearFileUpload = (name: any) => {
        if (name.current) {
            name.current.clearFileInput();
        }
    }





    // Create a ref to store the ObjectId, ensuring it only gets generated once
    const objectIdRef = useRef(new ObjectId());
    const objectId = objectIdRef.current;
    useEffect(() => {
        setFields({
            ...fields, _id: objectId.toString(),
            details: { ...fields.details, step: realStep },
            reg_key: 'AGANCE'
        })
    }, [objectId])


    const [showAttchImage, setShowAttchImage] = useState<any>(false)
    const [attchImageSrc, setAttchImageSrc] = useState<any>('')
    const [action_name, setActionName] = useState<any>('select')
    const [InsertOrUpdate, setInsertOrUpdate] = useState<any>('insert')
    const [selectedTab, setSelectedTab] = useState<any>('list')

    const [BirthDateDatePicker, setBirthDateDatePicker] = useState<any>(null);
    const [BirthDate, setBirthDate] = useState<any>(null);
    const [fishDateDatePicker, setfishDateDatePicker] = useState<any>(null);
    const [fishDate, setfishDate] = useState<any>(null);


    const [showAlert, setShowAlert] = useState<any>(false)
    const [imagesBase64, setImagesBase64] = useState<any>({});
    const [fields, setFields] = useState<Partial<Driver>>(initialValue);

    //validate
    const { errors: validateErrors, refreshData: validateRefreshData } = useValidateForm(validationRules, fields)
    useEffect(() => {
        console.log(100, Object.keys(validateErrors));

    }, [validateErrors])

    const options = [{ id: 1, value: 10 }, { id: 2, value: 30 }, { id: 3, value: 50 }]
    const thead = [
        // { key: 'id', name: 'شناسه' },
        { key: '', name: theadCRUD },
        { key: 'full_name', name: 'نام راننده', img: false },
        { key: 'username', name: 'نام کاربری', img: false },
    ]

    const [ItemsList, setItemsList] = useState<any[]>([])
    const [ItemForExport, setItemForExport] = useState<any[]>([])
    const [OriginalItems, setOriginalItems] = useState<any[]>([])

    // const result: any = []
    // const respType: any = ''
    const { result, type: respType, state, refreshData } = useAganceDriver(action_name, fields)

    useEffect(() => {
        if (result) {
            switch (respType) {
                case 'insert':
                    if (result?.status === 200) {
                        NotificationController.showSuccess('راننده ثبت شد')
                        setActionName('select')
                    }
                    else {
                        if (result?.status === 201) {
                            NotificationController.showError('کد ملی وارد شده تکراری است.')
                        }
                        else {
                            NotificationController.showError('راننده ثبت نشد')
                        }

                    }
                    break;
                case 'update':
                    if (result?.status === 200) {
                        NotificationController.showSuccess('راننده ویرایش شد')
                        setActionName('select')
                    }
                    else {
                        NotificationController.showError('راننده ویرایش نشد')
                    }
                    break;
                case 'delete':
                    if (result?.status === 200) {
                        NotificationController.showSuccess('راننده حذف شد')
                        setActionName('select')
                    }
                    else {
                        NotificationController.showError('راننده حذف نشد')
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

        setItemForExport(data.map((item: any) => ({
            full_name: item.full_name,
            phone: item.phone
        })))
    }

    const clearFormInputs = () => {

        if (realStep === 1) {
            setBirthDateDatePicker(null);
            setBirthDate(null);

            setfishDateDatePicker(null);
            setfishDate(null);
        }


        clearAllUplodedFile()

        setShowAttchImage(false)
        setAttchImageSrc('')
        objectIdRef.current = new ObjectId();
        setFields(initialValue)
        setImagesBase64({})
        setActionName(null)
        setInsertOrUpdate('insert')
    }

    const clearAllUplodedFile = () => {
        if (realStep === 1) {
            clearFileUpload('cartMelli')
            clearFileUpload('shenasname')
            clearFileUpload('payanekhedmat')
            clearFileUpload('rooyeGovahiname')
            clearFileUpload('poshteGovahiname')
            clearFileUpload('driverPic')
        }
        if (realStep === 2) {
            clearFileUpload('estelameGovahiname')
            clearFileUpload('tashkhisHoviyat')
            clearFileUpload('markazeBehdasht')
            clearFileUpload('mojavezeAmaken')
        }
        if (realStep === 3) {
            clearFileUpload('rooyeCartKhodro')
            clearFileUpload('poshtCartKhodro')
            clearFileUpload('bargeSabz')
            clearFileUpload('bime')
            clearFileUpload('moayeneFanni')
        }
    }

    const handleChangeBirthDate = (date: any) => {
        setBirthDateDatePicker(date);
        setBirthDate(date.format('YYYY/MM/DD', { calendar: 'persian', locale: 'fa' }))
        setFields({ ...fields, details: { ...fields.details, birthDate: convertDateToISO(persianDateToGregorian(date.format('YYYY/MM/DD', { calendar: 'persian', locale: 'fa' }))) } })
    }

    const handleChangeFishDate = (date: any) => {
        setfishDateDatePicker(date);
        setfishDate(date.format('YYYY/MM/DD', { calendar: 'persian', locale: 'fa' }))
        setFields({ ...fields, details: { ...fields.details, fishDate: convertDateToISO(persianDateToGregorian(date.format('YYYY/MM/DD', { calendar: 'persian', locale: 'fa' }))) } })
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
            setFields({ ...fields, details: { ...fields.details, attachFile: { ...fields?.details?.attachFile, [fieldName]: fieldValue } } })
        }
    }

    const createShomareParvane = () => {
        const maxShomareparvande = OriginalItems
            .filter(item => item?.details?.shomareParvane !== undefined)
            .reduce((max, item) => Math.max(max, item?.details?.shomareParvane), 1100);

        console.log(500, maxShomareparvande);

        return maxShomareparvande || 1100
    }

    const handleApprove = () => {
        console.log(5, fields);
        if (fields?.details?.step && fields?.details?.step < 4) {
            setFields({
                ...fields,
                details: { ...fields?.details, step: fields?.details?.step ? fields?.details?.step + 1 : 7 },
                full_name: `${fields?.details?.name} ${fields?.details?.family}`,
            });
        }
        if (fields?.details?.step && fields?.details?.step === 4) {
            const shomareParvane = createShomareParvane()
            setFields({
                ...fields,
                details: { ...fields?.details, shomareParvane: shomareParvane, step: fields?.details?.step ? fields?.details?.step + 1 : 7 },
                full_name: `${fields?.details?.name} ${fields?.details?.family}`,
                status: 'ACTIVE'
            });
        }

        setActionName('update')
    }

    const handleClick = (type: any) => {
        switch (type) {
            case 'insert':
                setFields({ ...fields, full_name: `${fields?.details?.name} ${fields?.details?.family}` })
                setActionName('insert')
                break;

            case 'update':
                setFields({ ...fields, full_name: `${fields?.details?.name} ${fields?.details?.family}` })
                setActionName('update')
                break;
        }
    }

    const clickOnRowDataGrid = (item: Driver, type: any) => {

        if (type === 'delete') {
            setFields(item)
            setActionName('delete')
        }
        if (type === 'update') {

            clearAllUplodedFile()

            const updateItem: Driver = (OriginalItems.filter((e: any) => e._id === item._id))[0]

            console.log(120, updateItem);


            updateItem?.details?.attachFile?.cartMelli && fileUploadRef_cartMelli.current?.setFileInput(updateItem?.details?.attachFile?.cartMelli)
            updateItem?.details?.attachFile?.shenasname && fileUploadRef_shenasname.current?.setFileInput(updateItem?.details?.attachFile?.shenasname)
            updateItem?.details?.attachFile?.payanekhedmat && fileUploadRef_payanekhedmat.current?.setFileInput(updateItem?.details?.attachFile?.payanekhedmat)

            updateItem?.details?.attachFile?.rooyeGovahiname && fileUploadRef_rooyeGovahiname.current?.setFileInput(updateItem?.details?.attachFile?.rooyeGovahiname)
            updateItem?.details?.attachFile?.poshteGovahiname && fileUploadRef_poshteGovahiname.current?.setFileInput(updateItem?.details?.attachFile?.poshteGovahiname)
            updateItem?.details?.attachFile?.driverPic && fileUploadRef_driverPic.current?.setFileInput(updateItem?.details?.attachFile?.driverPic)
            updateItem?.details?.attachFile?.estelameGovahiname && fileUploadRef_estelameGovahiname.current?.setFileInput(updateItem?.details?.attachFile?.estelameGovahiname)
            updateItem?.details?.attachFile?.tashkhisHoviyat && fileUploadRef_tashkhisHoviyat.current?.setFileInput(updateItem?.details?.attachFile?.tashkhisHoviyat)
            updateItem?.details?.attachFile?.markazeBehdasht && fileUploadRef_markazeBehdasht.current?.setFileInput(updateItem?.details?.attachFile?.markazeBehdasht)
            updateItem?.details?.attachFile?.mojavezeAmaken && fileUploadRef_mojavezeAmaken.current?.setFileInput(updateItem?.details?.attachFile?.mojavezeAmaken)

            updateItem?.details?.birthDate && setBirthDateDatePicker(moment(updateItem?.details?.birthDate).format('jYYYY/jMM/jDD'));
            console.log(13, updateItem?.details?.fishDate)//,moment(updateItem?.details?.birthDate).format('jYYYY/jMM/jDD'));

            //  updateItem?.details?.fishDate && setfishDateDatePicker(moment(updateItem?.details?.fishDate).format('jYYYY/jMM/jDD'));

            // console.log(120120,BirthDateDatePicker);

            setFields(updateItem)
            SteRealStep(updateItem?.details?.step)
            setInsertOrUpdate('update')
        }
    }

    useEffect(() => {
        // console.log(6,fields);

    }, [fields])

    const showAttachImage = (name: any) => {
        setAttchImageSrc(imagesBase64[name])
        setShowAttchImage(true)
    }

    const handleCheckboxChange = (event: any) => {
        const { value, checked } = event.target;
        let newActivityContext: any;

        if (checked) {
            newActivityContext = [...(fields?.details?.activityContext || []), value];
        } else {
            newActivityContext = (fields?.details?.activityContext || []).filter(item => item !== value);

        }

        setFields({ ...fields, details: { ...fields?.details, activityContext: newActivityContext } });
    };

    return (

        <div className='agance-component AganceDriver-component'>
            {handleBackClick && <i className='fa fa-arrow-left back-icon' onClick={handleBackClick}></i>}

            {showAlert && permit.CREATE === true && <div className="myalert">
                <div className="alert alert-info alert-dismissible">
                    {/* <i className='fa fa-remove close-icon' onClick={() => setShowAlert(false)}></i> */}
                    <p>{`کاربر محترم ، رانندگان  متقاضی دریافت کارت صلاحیت باید حائز شرایط زیر باشند`}
                        <i className='far fa-grin-beam eimoji-icon'></i>
                    </p>
                    <p> {`متاهل یا دارای فرم کفالت و سرپرستی خانواده، کارت پایان خدمت، بدون شغل و پروانه کسب ، گواهینامه معتبر رانندگی`}</p>
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
                        <i onClick={() => { setSelectedTab('list'); setShowAlert(false) }} className={selectedTab === 'list' ? 'active' : ''}>{'لیست راننده ها'}</i>
                    </div>
                    <div className="page-title">
                        <i onClick={() => { setSelectedTab('insert'); InsertOrUpdate === 'insert' ? setShowAlert(true) : setShowAlert(false) }} className={selectedTab === 'insert' ? 'active' : ''}>{InsertOrUpdate === 'insert' ? title : 'بروزرسانی راننده'}</i>
                    </div>
                </div>
            </div>

            <div style={{ display: `${selectedTab === 'list' ? '' : 'none'}` }} className="row gridRow">
                <div className="col-12">
                    {ItemsList?.length === 0 && <p>{'موردی برای نمایش وجود ندارد'}</p>}
                    {ItemsList?.length > 0 &&
                        <>
                            <Print content={ItemForExport} />
                            <Pdf content={ItemForExport} fileName={`excle-${moment(new Date()).format('jYYYY/jMM/jDD')}`} />
                            <Word content={ItemForExport} fileName={`excle-${moment(new Date()).format('jYYYY/jMM/jDD')}`} />
                            <Excel content={ItemForExport} fileName={`excle-${moment(new Date()).format('jYYYY/jMM/jDD')}`} />

                            <DataGrid
                                clickOnRow={clickOnRowDataGrid}
                                pagesize={options[0].value}
                                items={ItemsList}
                                options={options}
                                thead={thead}
                            />
                        </>
                    }
                </div>
            </div>


            <div style={{ display: `${selectedTab === 'insert' ? '' : 'none'}` }} className='aganceRegister-component'>

                {InsertOrUpdate === 'insert' && permit.CREATE === false && <p> <Page403 /></p>}
                {((InsertOrUpdate === 'insert' && permit.CREATE === true) || InsertOrUpdate === 'update') &&
                    <>
                        <div className="row upRow">
                            <div className="col-12">
                                {InsertOrUpdate === 'update' && <button onClick={() => { clearFormInputs(); SteRealStep(1); setInsertOrUpdate('insert') }} className='my-btn'>{title}</button>}
                                {InsertOrUpdate === 'update' && isPermitForApprove === true && realStep <= 4 &&
                                    < button
                                        onClick={() => handleApprove()}
                                        className='my-btn'>
                                        {realStep === 1 ? 'تایید اطلاعات هویتی' :
                                            realStep === 2 ? 'تایید استعلامات' :
                                                realStep === 3 ? 'تایید اطلاعات خودرو' :
                                                    realStep === 4 ? 'تایید  نهایی راننده' :
                                                        ''}
                                    </button>
                                }
                            </div>
                        </div>


                        <div className="row">
                            <div className="col-12">
                                <div
                                    className={`my-step ${step === 1 ? 'my-step-active' : ''}`} onClick={() => SteStep(1)}>{`ثبت اطلاعات هویتی`}
                                    {realStep > 1 && <i className='fa fa-check tik-icon'></i>} </div>

                                <div
                                    className={`my-step ${step === 2 ? 'my-step-active' : ''}`} onClick={() => SteStep(2)}>{`بارگزاری استعلامات`}
                                    {realStep > 2 && <i className='fa fa-check tik-icon'></i>}</div>

                                <div
                                    className={`my-step ${step === 3 ? 'my-step-active' : ''}`} onClick={() => { SteStep(3); console.log(522, fields?._id); setreftreshVehicle(!reftreshVehicle) }}>{`ثبت اطلاعات خودرو`}
                                    {realStep > 3 && <i className='fa fa-check tik-icon'></i>} </div>

                            </div>
                        </div>


                        {/* step 1 */}
                        <div style={{ display: `${step === 1 ? '' : 'none'}` }} className="row">

                            {/* <div className="col-6">
                                <div className="form-group">
                                    <p>نام کاربری </p>
                                    <input disabled={realStep === 1 ? false : true} onChange={(e) => setFields({ ...fields, username: e.target.value })} value={fields?.username || ''} type="text" className="form-control" />
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>پسورد </p>
                                    <input disabled={realStep === 1 ? false : true} onChange={(e) => setFields({ ...fields, password: e.target.value })} value={fields?.password || ''} type="text" className="form-control" />
                                </div>
                            </div> */}

                            <div className="col-6">
                                <div className="form-group">
                                    <p>نام </p>
                                    <input disabled={realStep === 1 ? false : true} onChange={(e) => setFields({ ...fields, details: { ...fields.details, name: e.target.value } })} value={fields?.details?.name || ''} type="text" className="form-control" />
                                    {validateErrors['details.name']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['details.name']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>نام خانوادگی </p>
                                    <input disabled={realStep === 1 ? false : true} onChange={(e) => setFields({ ...fields, details: { ...fields.details, family: e.target.value } })} value={fields?.details?.family || ''} type="text" className="form-control" />
                                    {validateErrors['details.family']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['details.family']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>نام پدر </p>
                                    <input disabled={realStep === 1 ? false : true} onChange={(e) => setFields({ ...fields, details: { ...fields.details, fatherName: e.target.value } })} value={fields?.details?.fatherName || ''} type="text" className="form-control" />
                                    {validateErrors['details.fatherName']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['details.fatherName']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>نام مستعار </p>
                                    <input disabled={realStep === 1 ? false : true} onChange={(e) => setFields({ ...fields, details: { ...fields.details, nikName: e.target.value } })} value={fields?.details?.nikName || ''} type="text" className="form-control" />
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>کد ملی  </p>
                                    <input disabled={realStep === 1 ? false : true} onChange={(e) => setFields({ ...fields, username: e.target.value, password: e.target.value, details: { ...fields.details, nat_num: e.target.value } })} value={fields?.details?.nat_num || ''} type="text" className="form-control" />
                                    {validateErrors['details.nat_num']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['details.nat_num']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>شماره شناسنامه / سری و سریال  </p>
                                    <input disabled={realStep === 1 ? false : true} onChange={(e) => setFields({ ...fields, details: { ...fields.details, shomare_shenasname: e.target.value } })} value={fields?.details?.shomare_shenasname || ''} type="text" className="form-control" />
                                    {validateErrors['details.shomare_shenasname']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['details.shomare_shenasname']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>تاریخ تولد  </p>

                                    <DatePicker
                                        style={{ backgroundColor: realStep === 1 ? '' : '#e9ecef' }}
                                        disabled={realStep === 1 ? false : true}
                                        onChange={(date) => handleChangeBirthDate(date !== null ? (Array.isArray(date) ? date[0] : date) : null)}
                                        calendar={persian}
                                        locale={persian_fa}
                                        className={`datetime-picker`}
                                        inputClass="datetime-input !text-center !text-lg !p-4"
                                        value={BirthDateDatePicker}
                                        placeholder=''
                                    />

                                    {validateErrors['details.birthDate']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['details.birthDate']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>صادره  </p>
                                    <input disabled={realStep === 1 ? false : true} onChange={(e) => setFields({ ...fields, details: { ...fields.details, sadere: e.target.value } })} value={fields?.details?.sadere || ''} type="text" className="form-control" />
                                    {validateErrors['details.sadere']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['details.sadere']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>محل فعالیت  </p>
                                    {activityContextOptions.map((option: any) => (
                                        <div key={option}>
                                            <input
                                                disabled={realStep === 1 ? false : true}
                                                type="checkbox"
                                                value={option}
                                                checked={fields?.details?.activityContext?.includes(option)}
                                                onChange={handleCheckboxChange}
                                            />
                                            <label>{option}</label>
                                        </div>
                                    ))}
                                    {validateErrors['details.activityContext']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['details.activityContext']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>جنسیت  </p>
                                    <select disabled={realStep === 1 ? false : true}
                                        onChange={(e) => setFields({ ...fields, details: { ...fields.details, gender: e.target.value } })}
                                        className='form-control' value={fields?.details?.gender as string || "مرد"}>
                                        <option value="مرد">مرد</option>
                                        <option value="زن">زن</option>
                                    </select>
                                    {validateErrors['details.gender']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['details.gender']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>آدرس  </p>
                                    <input disabled={realStep === 1 ? false : true} onChange={(e) => setFields({ ...fields, details: { ...fields.details, address: e.target.value } })} value={fields?.details?.address || ''} type="text" className="form-control" />
                                    {validateErrors['details.address']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['details.sddress']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>کد پستی  </p>
                                    <input disabled={realStep === 1 ? false : true} onChange={(e) => setFields({ ...fields, details: { ...fields.details, postalCode: e.target.value } })} value={fields?.details?.postalCode || ''} type="text" className="form-control" />
                                    {validateErrors['details.postalCode']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['details.postalCode']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>تلفن منزل  </p>
                                    <input disabled={realStep === 1 ? false : true} onChange={(e) => setFields({ ...fields, details: { ...fields.details, homePhone: e.target.value } })} value={fields?.details?.homePhone || ''} type="text" className="form-control" />
                                    {validateErrors['details.homePhone']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['details.homePhone']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>


                            <div className="col-6">
                                <div className="form-group">
                                    <p>تلفن همراه  </p>
                                    <input disabled={realStep === 1 ? false : true} onChange={(e) => setFields({ ...fields, phone: e.target.value })} value={fields?.phone || ''} type="text" className="form-control" />
                                    {validateErrors['phone']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['phone']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>مدرک تحصیلی  </p>
                                    <input disabled={realStep === 1 ? false : true} onChange={(e) => setFields({ ...fields, details: { ...fields.details, madrakeTahsili: e.target.value } })} value={fields?.details?.madrakeTahsili || ''} type="text" className="form-control" />
                                    {validateErrors['details.madrakeTahsili']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['details.madrakeTahsili']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>رشته تحصیلی  </p>
                                    <input disabled={realStep === 1 ? false : true} onChange={(e) => setFields({ ...fields, details: { ...fields.details, reshteTahsili: e.target.value } })} value={fields?.details?.reshteTahsili || ''} type="text" className="form-control" />
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>وضعیت تاهل  </p>
                                    <select disabled={realStep === 1 ? false : true}
                                        onChange={(e) => setFields({ ...fields, details: { ...fields.details, taahol: e.target.value } })}
                                        className='form-control' value={fields?.details?.taahol as string || "مجرد"}>
                                        <option value="مجرد">مجرد</option>
                                        <option value="متاهل">متاهل</option>
                                        <option value="مطلقه">مطلقه</option>
                                        <option value="بیوه">بیوه</option>
                                    </select>
                                    {validateErrors['details.taahol']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['details.taahol']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>دین و مذهب  </p>
                                    <input disabled={realStep === 1 ? false : true} onChange={(e) => setFields({ ...fields, details: { ...fields.details, din: e.target.value } })} value={fields?.details?.din || ''} type="text" className="form-control" />
                                    {validateErrors['details.din']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['details.din']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>شماره کارت پایان خدمت  </p>
                                    <input disabled={realStep === 1 ? false : true}
                                        onChange={(e) => setFields({ ...fields, details: { ...fields.details, shomareKartePayanKhedmat: e.target.value } })} value={fields?.details?.shomareKartePayanKhedmat || ''} type="text" className="form-control" />
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p> تصویر کارت ملی</p>

                                    <div className="file-upload-div">

                                        <FileUpload
                                            disabled={realStep === 1 ? false : true}
                                            ref={fileUploadRef_cartMelli}
                                            name={'cartMelli'} id={objectId.toString()} handleGetBase64={handleGetBase64} />

                                        {fields?.details?.attachFile?.cartMelli && <i className='fa fa-eye my-eye-icon' onClick={() => showAttachImage('cartMelli')}></i>}
                                    </div>
                                    {validateErrors['details.attachFile.cartMelli']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['details.attachFile.cartMelli']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>تصویر شناسنامه  </p>
                                    <div className="file-upload-div">

                                        <FileUpload
                                            disabled={realStep === 1 ? false : true}
                                            ref={fileUploadRef_shenasname}
                                            name={'shenasname'} id={objectId.toString()} handleGetBase64={handleGetBase64} />

                                        {fields?.details?.attachFile?.shenasname && <i className='fa fa-eye my-eye-icon' onClick={() => showAttachImage('shenasname')}></i>}
                                    </div>
                                    {validateErrors['details.attachFile.shenasname']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['details.attachFile.shenasname']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>تصویر پایان خدمت  </p>
                                    <div className="file-upload-div">

                                        <FileUpload
                                            disabled={realStep === 1 ? false : true}
                                            ref={fileUploadRef_payanekhedmat}
                                            name={'payanekhedmat'} id={objectId.toString()} handleGetBase64={handleGetBase64} />

                                        {fields?.details?.attachFile?.payanekhedmat && <i className='fa fa-eye my-eye-icon' onClick={() => showAttachImage('payanekhedmat')}></i>}
                                    </div>
                                    {validateErrors['details.attachFile.payanekhedmat']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['details.attachFile.payanekhedmat']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>تصویر روی گواهینامه  </p>
                                    <div className="file-upload-div">

                                        <FileUpload
                                            disabled={realStep === 1 ? false : true}
                                            ref={fileUploadRef_rooyeGovahiname}
                                            name={'rooyeGovahiname'} id={objectId.toString()} handleGetBase64={handleGetBase64} />

                                        {fields?.details?.attachFile?.rooyeGovahiname && <i className='fa fa-eye my-eye-icon' onClick={() => showAttachImage('rooyeGovahiname')}></i>}
                                    </div>
                                    {validateErrors['details.attachFile.rooyeGovahiname']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['details.attachFile.rooyeGovahiname']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>


                            <div className="col-6">
                                <div className="form-group">
                                    <p>تصویر پشت گواهینامه  </p>
                                    <div className="file-upload-div">

                                        <FileUpload
                                            disabled={realStep === 1 ? false : true}
                                            ref={fileUploadRef_poshteGovahiname}
                                            name={'poshteGovahiname'} id={objectId.toString()} handleGetBase64={handleGetBase64} />

                                        {fields?.details?.attachFile?.poshteGovahiname && <i className='fa fa-eye my-eye-icon' onClick={() => showAttachImage('poshteGovahiname')}></i>}
                                    </div>
                                    {validateErrors['details.attachFile.poshteGovahiname']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['details.attachFile.poshteGovahiname']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>تصویر راننده  </p>
                                    <div className="file-upload-div">

                                        <FileUpload
                                            disabled={realStep === 1 ? false : true}
                                            ref={fileUploadRef_driverPic}
                                            name={'driverPic'} id={objectId.toString()} handleGetBase64={handleGetBase64} />

                                        {fields?.details?.attachFile?.driverPic && <i className='fa fa-eye my-eye-icon' onClick={() => showAttachImage('driverPic')}></i>}
                                    </div>
                                    {validateErrors['details.attachFile.driverPic']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['details.attachFile.driverPic']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>بیمه  </p>
                                    <select disabled={realStep === 1 ? false : true}
                                        onChange={(e) => setFields({ ...fields, details: { ...fields.details, bimeStatus: e.target.value } })}
                                        className='form-control' value={fields?.details?.bimeStatus as string || "ندارد"}>
                                        <option value="ندارد">ندارد</option>
                                        <option value="دارد">دارد</option>
                                    </select>
                                </div>
                            </div>

                            {fields?.details?.bimeStatus === 'دارد' &&
                                <div className="col-6">
                                    <div className="form-group">
                                        <p>شماره بیمه  </p>
                                        <input disabled={realStep === 1 ? false : true} onChange={(e) => setFields({ ...fields, details: { ...fields.details, shomareBime: e.target.value } })} value={fields?.details?.shomareBime || ''} type="text" className="form-control" />
                                    </div>
                                </div>
                            }

                            <div className="col-6">
                                <div className="form-group">
                                    <p>شماره فیش تشکیل پرونده  </p>
                                    <input disabled={realStep === 1 ? false : true} onChange={(e) => setFields({ ...fields, details: { ...fields.details, shomareFish: e.target.value } })} value={fields?.details?.shomareFish || ''} type="text" className="form-control" />
                                    {validateErrors['details.shomareFish']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['details.shomareFish']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>تاریخ  </p>

                                    <DatePicker
                                        style={{ backgroundColor: realStep === 1 ? '' : '#e9ecef' }}
                                        disabled={realStep === 1 ? false : true}
                                        onChange={(date) => handleChangeFishDate(date !== null ? (Array.isArray(date) ? date[0] : date) : null)}
                                        calendar={persian}
                                        locale={persian_fa}
                                        className={`datetime-picker`}
                                        inputClass="datetime-input !text-center !text-lg !p-4"
                                        value={fishDateDatePicker}
                                        placeholder=''
                                    />

                                    {validateErrors['details.fishDate']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['details.fishDate']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p> مبلغ (ریال)</p>
                                    <input disabled={realStep === 1 ? false : true} onChange={(e) => setFields({ ...fields, details: { ...fields.details, fishPrice: e.target.value.replace(/,/g, '') } })} value={fields?.details?.fishPrice?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || ''} type="text" className="form-control" />
                                    {validateErrors['details.fishPrice']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['details.fishPrice']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="form-group">
                                    <button
                                        disabled={realStep === 1 ? Object.keys(validateErrors).length === 4 ? false : true : false}
                                        onClick={() => handleClick(InsertOrUpdate === 'insert' ? 'insert' : 'update')}
                                        className={`my-btn ${realStep === 1 ? Object.keys(validateErrors).length === 4 ? '' : `my-btn-inactive` : 'inactive'}`}>
                                        {InsertOrUpdate === 'insert' ? 'ثبت' : 'بروز رسانی'}</button>
                                    <button disabled={realStep === 1 ? false : true}
                                        onClick={() => clearFormInputs()}
                                        className={`my-btn ${realStep === 1 ? '' : 'inactive'}`}>انصراف</button>
                                </div>
                            </div>
                        </div>

                        {/* step 2 */}
                        <div style={{ display: `${step === 2 ? '' : 'none'}` }} className="row">
                            <div className="col-6">
                                <div className="form-group">
                                    <p> استعلام گواهینامه  </p>
                                    <div className="file-upload-div">

                                        <FileUpload
                                            disabled={realStep === 2 ? false : true}
                                            ref={fileUploadRef_estelameGovahiname}
                                            name={'estelameGovahiname'} id={objectId.toString()} handleGetBase64={handleGetBase64} />

                                        {fields?.details?.attachFile?.estelameGovahiname && <i className='fa fa-eye my-eye-icon' onClick={() => showAttachImage('estelameGovahiname')}></i>}
                                    </div>
                                    {validateErrors['details.attachFile.estelameGovahiname']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['details.attachFile.estelameGovahiname']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }

                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>تشخیص هویت   </p>
                                    <div className="file-upload-div">

                                        <FileUpload
                                            disabled={realStep === 2 ? false : true}
                                            ref={fileUploadRef_tashkhisHoviyat}
                                            name={'tashkhisHoviyat'} id={objectId.toString()} handleGetBase64={handleGetBase64} />

                                        {fields?.details?.attachFile?.tashkhisHoviyat && <i className='fa fa-eye my-eye-icon' onClick={() => showAttachImage('tashkhisHoviyat')}></i>}
                                    </div>
                                    {validateErrors['details.attachFile.tashkhisHoviyat']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['details.attachFile.tashkhisHoviyat']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>مرکز بهداشت   </p>
                                    <div className="file-upload-div">

                                        <FileUpload
                                            disabled={realStep === 2 ? false : true}
                                            ref={fileUploadRef_markazeBehdasht}
                                            name={'markazeBehdasht'} id={objectId.toString()} handleGetBase64={handleGetBase64} />

                                        {fields?.details?.attachFile?.markazeBehdasht && <i className='fa fa-eye my-eye-icon' onClick={() => showAttachImage('markazeBehdasht')}></i>}
                                    </div>
                                    {validateErrors['details.attachFile.markazeBehdasht']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['details.attachFile.markazeBehdasht']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p> مجوز اداره اماکن  </p>
                                    <div className="file-upload-div">

                                        <FileUpload
                                            disabled={realStep === 2 ? false : true}
                                            ref={fileUploadRef_mojavezeAmaken}
                                            name={'mojavezeAmaken'} id={objectId.toString()} handleGetBase64={handleGetBase64} />

                                        {fields?.details?.attachFile?.mojavezeAmaken && <i className='fa fa-eye my-eye-icon' onClick={() => showAttachImage('mojavezeAmaken')}></i>}
                                    </div>
                                    {validateErrors['details.attachFile.mojavezeAmaken']?.length > 0 &&
                                        <>
                                            <div className='validate'>
                                                <i className='fa fa-exclamation-triangle'></i>
                                                <div className='error-msg'> {validateErrors['details.attachFile.mojavezeAmaken']?.map((error: any) => { return <p>{error}</p> })} </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="form-group">
                                    <button
                                        disabled={realStep === 2 ? false : Object.keys(validateErrors).length === 0 ? false : true}
                                        onClick={() => handleClick(InsertOrUpdate === 'insert' ? 'insert' : 'update')}
                                        className={`my-btn ${realStep === 2 ? Object.keys(validateErrors).length === 0 ? '' : `my-btn-inactive` : 'inactive'}`}>
                                        {InsertOrUpdate === 'insert' ? 'ثبت' : 'بروز رسانی'}</button>
                                    <button disabled={realStep === 2 ? false : true}
                                        onClick={() => clearFormInputs()}
                                        className={`my-btn ${realStep === 2 ? '' : 'inactive'}`}>انصراف</button>
                                </div>
                            </div>
                        </div>

                        {/* step 3 */}
                        <div style={{ display: `${step === 3 ? '' : 'none'}` }} className="row">
                            <div className="col-12">

                                <AganceVehicle refresh={reftreshVehicle} driverID={InsertOrUpdate === 'update' ? fields?._id || undefined : undefined} disabled={realStep === 3 ? false : true} />


                            </div>
                        </div>
                    </>
                }
            </div>
        </div >
    );
};

export default AganceDriver;