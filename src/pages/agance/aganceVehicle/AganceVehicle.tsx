import { useEffect, useRef, useState } from 'react';
import '../aganceRegister/style.scss';
import './style.scss'
import ObjectId from 'bson-objectid';
import moment from 'jalali-moment';
import FileUpload, { FileUploadHandles } from '../../../components/FileUpload/FileUpload';
import { NotificationController } from '../../../lib/notificationController';
import PlaqueInput from '../../Form/PlaqueInput';
import useAganceVehicle from '../../../hooks/data/Agance/useAganceVehicle';
import { convertStringToPlaque } from '../../../lib/string';
import { useValidateForm } from '../../../utils/validation';
import useAuthentication from '../../../hooks/data/useAuthentication';
import * as permitConstant from '../../../lib/constants'
import Page403 from '../../../components/Page403/Page403';

interface Agance_Vehicle {
    _id: string,
    id: string,
    group?: string,
    driver_user?: string,
    status?: string,
    plaque?: string,
    services?: [{ service?: string, capacity: number }]
    extra?: {
        driver?: {
            driver_id?: string
        },
        type?: string,
        system?: string;
        model?: string,
        shasi_num?: string,
        motor_num?: string,
        VIN?: string,
        color?: string,
        sookht?: string,
        attachFile?: {
            rooyeCartKhodro?: string;
            poshtCartKhodro?: string;
            bargeSabz?: string;
            bime?: string;
            moayeneFanni?: string;
        }
    }
}

const Agance_VehicleRules2: any = {
}
const Agance_VehicleRules: any = {
    "extra.type": {
        required: true,
        showName: ''
    },
    "extra.system": {
        required: true,
        showName: ''
    },
    "extra.model": {
        required: true,
        showName: ''
    },
    "extra.shasi_num": {
        required: true,
        showName: ''
    },
    "extra.motor_num": {
        required: true,
        showName: ''
    },
    "extra.VIN": {
        required: true,
        showName: ''
    },
    "extra.color": {
        required: true,
        showName: ''
    },
    "extra.sookht": {
        required: true,
        showName: ''
    },
    plaque: {
        required: true,
        showName: ''
    },
    "extra.attachFile.rooyeCartKhodro": {
        required: true,
        showName: ''
    },
    "extra.attachFile.poshtCartKhodro": {
        required: true,
        showName: ''
    },
    "extra.attachFile.bargeSabz": {
        required: true,
        showName: ''
    },
    "extra.attachFile.bime": {
        required: true,
        showName: ''
    },
    "extra.attachFile.moayeneFanni": {
        required: true,
        showName: ''
    },
};

const initialValue: any = {
    plaque: '',
    // services?: [{ service?: string, capacity: number }]
    extra: {
        type: '',
        system: '',
        model: '',
        shasi_num: '',
        motor_num: '',
        VIN: '',
        color: '',
        sookht: '',
        attachFile: {
            rooyeCartKhodro: '',
            poshtCartKhodro: '',
            bargeSabz: '',
            bime: '',
            moayeneFanni: '',
        }
    }
}


const AganceVehicle = ({ refresh, disabled, driverID }: any) => {

    // console.log(100, driverID);

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
                if (permission === permitConstant.PERMIT_VEHICLES_CREATE) {
                    newPermit.CREATE = true
                }
                if (permission === permitConstant.PERMIT_VEHICLES_EDIT) {
                    newPermit.EDIT = true
                    thead_crud += '- update -'
                }
                if (permission === permitConstant.PERMIT_VEHICLES_DELETE) {
                    newPermit.DELETE = true
                    thead_crud += '- delete -'
                }
            })
        })
        setPermit(newPermit)
        setTheadCRUD(thead_crud)
    }, [authInfo])

    useEffect(() => {
        // console.log(78, driverID);

        driverID && clickOnRowDataGridWithDriver_user(driverID)
    }, [refresh])
    const plaqueRef = useRef<any>();
    const fileUploadRef_rooyeCartKhodro = useRef<FileUploadHandles>(null);
    const fileUploadRef_poshtCartKhodro = useRef<FileUploadHandles>(null);
    const fileUploadRef_bargeSabz = useRef<FileUploadHandles>(null);
    const fileUploadRef_bime = useRef<FileUploadHandles>(null);
    const fileUploadRef_moayeneFanni = useRef<FileUploadHandles>(null);
    const [vehicle, setVehicle] = useState<any>(undefined)

    const clearFileUpload = (name: any) => {
        if (name.current) {
            name.current.clearFileInput();
        }
    }



    // Create a ref to store the ObjectId, ensuring it only gets generated once
    const objectIdRef = useRef(new ObjectId());
    const objectId = objectIdRef.current

    useEffect(() => {
        setFields({
            ...fields,
            _id: objectId.toString(),
            group: 'نامشخص',
            driver_user: driverID ? driverID : null,
            status: 'IDLE',
            extra: { ...fields.extra, driver: { ...fields?.extra?.driver, driver_id: driverID ? driverID : null } },
            services: [{ service: 'taksisroys', capacity: 2 }]
        })
    }, [objectId])



    const [showAttchImage, setShowAttchImage] = useState<any>(false)
    const [attchImageSrc, setAttchImageSrc] = useState<any>('')
    const [action_name, setActionName] = useState<any>('select')
    const [InsertOrUpdate, setInsertOrUpdate] = useState<any>('insert')
    const [selectedTab, setSelectedTab] = useState<any>('list')
    const [StartActivityDateDatePicker, setStartActivityDateDatePicker] = useState<any>(moment(new Date()).format('jYYYY/jMM/jDD'));
    const [StartActivityDate, setStartActivityDate] = useState<any>(moment(new Date()).format('jYYYY/jMM/jDD'));
    const [showAlert, setShowAlert] = useState<any>(false)
    const [imagesBase64, setImagesBase64] = useState<any>({});
    const [fields, setFields] = useState<Partial<Agance_Vehicle>>(initialValue);


    //validate
    const { errors: validateErrors, refreshData: validateRefreshData } = useValidateForm(Agance_VehicleRules, fields)
    useEffect(() => {
        //  console.log(100, Object.keys(validateErrors));

    }, [validateErrors])

    const options = [{ id: 1, value: 10 }, { id: 2, value: 30 }, { id: 3, value: 50 }]
    const thead = [
        { key: 'id', name: theadCRUD },
        { key: '', name: '' },
        { key: '_id', name: 'شناسه', img: false },
    ]

    const [ItemsList, setItemsList] = useState<any[]>([])
    const [OriginalItems, setOriginalItems] = useState<any[]>([])

    // const result: any = []
    // const respType: any = ''
    const { result, type: respType, state, refreshData } = useAganceVehicle(action_name, fields)

    useEffect(() => {
        if (result) {
            switch (respType) {
                case 'insert':
                    if (result?.status === 200) {
                        NotificationController.showSuccess('خودرو ثبت شد')
                        setActionName('select')
                    }
                    else {
                        NotificationController.showError('خودرو ثبت نشد')
                    }
                    break;
                case 'update':
                    if (result?.status === 200) {
                        NotificationController.showSuccess('خودرو ویرایش شد')
                        setActionName('select')
                    }
                    else {
                        NotificationController.showError('خودرو ویرایش نشد')
                    }
                    break;
                case 'delete':
                    if (result?.status === 200) {
                        NotificationController.showSuccess('خودرو حذف شد')
                        setActionName('select')
                    }
                    else {
                        NotificationController.showError('خودرو حذف نشد')
                    }
                    break;
                case 'select':
                    setOriginalItems(result?.data?.data)
                    // const ite = result?.data?.data?.filter((ite: any) => ite.driver_user !== null && ite.driver_user !== undefined && ite.driver_user === driverID)
                    //clickOnRowDataGridWithDriver_user(driverID, 'update')
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
    }

    const clearFormInputs = () => {

        plaqueRef?.current?.resetToDefaults();

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

    const clearAllUplodedFile = () => {
        clearFileUpload('rooyeCartKhodro')
        clearFileUpload('poshtCartKhodro')
        clearFileUpload('bargeSabz')
        clearFileUpload('bime')
        clearFileUpload('moayeneFanni')
    }

    const handleChangeStartActivityDate = (date: any) => {
        //     setStartActivityDateDatePicker(date);
        //     setStartActivityDate(date.format('YYYY/MM/DD', { calendar: 'persian', locale: 'fa' }))
        //     setFields({ ...fields, StartActivityDate: convertDateToISO(persianDateToGregorian(date.format('YYYY/MM/DD', { calendar: 'persian', locale: 'fa' }))) })
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
            setFields({ ...fields, extra: { ...fields.extra, attachFile: { ...fields?.extra?.attachFile, [fieldName]: fieldValue } } })
        }
    }


    const handleClick = (type: any) => {
        //  console.log(120,type);

        switch (type) {
            case 'insert':
                setActionName('insert')
                break;

            case 'update':
                console.log(111, fields);

                setActionName('update')
                break;
        }
    }


    const clickOnRowDataGridWithDriver_user = (driver_user: any) => {



        clearAllUplodedFile()

        const updateItem = (OriginalItems.filter((e: any) => e.driver_user === driver_user && e.driver_user !== null && e.driver_user !== undefined))[0]

        console.log(50, updateItem);
        if (updateItem) {
            updateItem?.attachFile?.rooyeCartKhodro && fileUploadRef_rooyeCartKhodro.current?.setFileInput(updateItem?.attachFile?.rooyeCartKhodro)
            updateItem?.attachFile?.poshtCartKhodro && fileUploadRef_poshtCartKhodro.current?.setFileInput(updateItem?.attachFile?.poshtCartKhodro)
            updateItem?.attachFile?.bargeSabz && fileUploadRef_bargeSabz.current?.setFileInput(updateItem?.attachFile?.bargeSabz)
            updateItem?.attachFile?.bime && fileUploadRef_bime.current?.setFileInput(updateItem?.attachFile?.bime)
            updateItem?.attachFile?.moayeneFanni && fileUploadRef_moayeneFanni.current?.setFileInput(updateItem?.attachFile?.moayeneFanni)
            setFields(updateItem)
            setInsertOrUpdate('update')
        }
        else {
            console.log(555, fields);

            setInsertOrUpdate('insert')
        }

    }

    const clickOnRowDataGrid = (item: Agance_Vehicle, type: any) => {

        if (type === 'delete') {
            setFields(item)
            setActionName('delete')
        }
        if (type === 'update') {

            clearAllUplodedFile()

            const updateItem = (OriginalItems.filter((e: any) => e._id === item._id))[0]

            updateItem?.attachFile?.rooyeCartKhodro && fileUploadRef_rooyeCartKhodro.current?.setFileInput(updateItem?.attachFile?.rooyeCartKhodro)
            updateItem?.attachFile?.poshtCartKhodro && fileUploadRef_poshtCartKhodro.current?.setFileInput(updateItem?.attachFile?.poshtCartKhodro)
            updateItem?.attachFile?.bargeSabz && fileUploadRef_bargeSabz.current?.setFileInput(updateItem?.attachFile?.bargeSabz)
            updateItem?.attachFile?.bime && fileUploadRef_bime.current?.setFileInput(updateItem?.attachFile?.bime)
            updateItem?.attachFile?.moayeneFanni && fileUploadRef_moayeneFanni.current?.setFileInput(updateItem?.attachFile?.moayeneFanni)


            // console.log(65689, updateItem.StartActivityDate);

            // setStartActivityDateDatePicker(moment(updateItem.StartActivityDate).format('jYYYY/jMM/jDD'));

            setFields(updateItem)
            setInsertOrUpdate('update')
        }
    }

    useEffect(() => {

        console.log(2536, fields);

    }, [fields])

    const showAttachImage = (name: any) => {
        setAttchImageSrc(imagesBase64[name])
        setShowAttchImage(true)
    }

    const handle_plaqueChange = (value: any) => {
        // console.log(401, `${value.twoDigit},${value.threeDigit},${value.serial},${value.character}`, value);

        setFields({ ...fields, plaque: `${value.twoDigit},${value.threeDigit},${value.character},${value.serial}` });
    };



    return (

        <div className='agance-component AganceVehicle-component'>
            {InsertOrUpdate === 'insert' && permit.CREATE === false && <p> <Page403 /></p>}
            {((InsertOrUpdate === 'insert' && permit.CREATE === true) || InsertOrUpdate === 'update') &&
                <>
                    <div className="row">
                        <div className="col-6">
                            <div className="form-group">
                                <p>نوع خودرو   </p>
                                <input disabled={disabled} onChange={(e) => setFields({ ...fields, extra: { ...fields?.extra, type: e.target.value } })} value={fields?.extra?.type || ''} type="text" className="form-control" />

                                {validateErrors['extra.type']?.length > 0 &&
                                    <>
                                        <div className='validate'>
                                            <i className='fa fa-exclamation-triangle'></i>
                                            <div className='error-msg'> {validateErrors['extra.type']?.map((error: any) => { return <p>{error}</p> })} </div>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-group">
                                <p> سیستم  </p>
                                <input disabled={disabled} onChange={(e) => setFields({ ...fields, extra: { ...fields?.extra, system: e.target.value } })} value={fields?.extra?.system || ''} type="text" className="form-control" />
                                {validateErrors['extra.system']?.length > 0 &&
                                    <>
                                        <div className='validate'>
                                            <i className='fa fa-exclamation-triangle'></i>
                                            <div className='error-msg'> {validateErrors['extra.system']?.map((error: any) => { return <p>{error}</p> })} </div>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-group">
                                <p>مدل   </p>
                                <input disabled={disabled} onChange={(e) => setFields({ ...fields, extra: { ...fields?.extra, model: e.target.value } })} value={fields?.extra?.model || ''} type="text" className="form-control" />
                                {validateErrors['extra.model']?.length > 0 &&
                                    <>
                                        <div className='validate'>
                                            <i className='fa fa-exclamation-triangle'></i>
                                            <div className='error-msg'> {validateErrors['extra.model']?.map((error: any) => { return <p>{error}</p> })} </div>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-group">
                                <p> شماره شاسی  </p>
                                <input disabled={disabled} onChange={(e) => setFields({ ...fields, extra: { ...fields?.extra, shasi_num: e.target.value } })} value={fields?.extra?.shasi_num || ''} type="text" className="form-control" />

                                {validateErrors['extra.shasi_num']?.length > 0 &&
                                    <>
                                        <div className='validate'>
                                            <i className='fa fa-exclamation-triangle'></i>
                                            <div className='error-msg'> {validateErrors['extra.shasi_num']?.map((error: any) => { return <p>{error}</p> })} </div>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-group">
                                <p> شماره موتور  </p>
                                <input disabled={disabled} onChange={(e) => setFields({ ...fields, extra: { ...fields?.extra, motor_num: e.target.value } })} value={fields?.extra?.motor_num || ''} type="text" className="form-control" />
                                {validateErrors['extra.motor_num']?.length > 0 &&
                                    <>
                                        <div className='validate'>
                                            <i className='fa fa-exclamation-triangle'></i>
                                            <div className='error-msg'> {validateErrors['extra.motor_num']?.map((error: any) => { return <p>{error}</p> })} </div>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-group">
                                <p>VIN   </p>
                                <input disabled={disabled} onChange={(e) => setFields({ ...fields, extra: { ...fields?.extra, VIN: e.target.value } })} value={fields?.extra?.VIN || ''} type="text" className="form-control" />
                                {validateErrors['extra.VIN']?.length > 0 &&
                                    <>
                                        <div className='validate'>
                                            <i className='fa fa-exclamation-triangle'></i>
                                            <div className='error-msg'> {validateErrors['extra.VIN']?.map((error: any) => { return <p>{error}</p> })} </div>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-group">
                                <p>رنگ   </p>
                                <input disabled={disabled} onChange={(e) => setFields({ ...fields, extra: { ...fields?.extra, color: e.target.value } })} value={fields?.extra?.color || ''} type="text" className="form-control" />
                                {validateErrors['extra.color']?.length > 0 &&
                                    <>
                                        <div className='validate'>
                                            <i className='fa fa-exclamation-triangle'></i>
                                            <div className='error-msg'> {validateErrors['extra.color']?.map((error: any) => { return <p>{error}</p> })} </div>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-group">
                                <p>سوخت   </p>
                                <input disabled={disabled} onChange={(e) => setFields({ ...fields, extra: { ...fields?.extra, sookht: e.target.value } })} value={fields?.extra?.sookht || ''} type="text" className="form-control" />
                                {validateErrors['extra.sookht']?.length > 0 &&
                                    <>
                                        <div className='validate'>
                                            <i className='fa fa-exclamation-triangle'></i>
                                            <div className='error-msg'> {validateErrors['extra.sookht']?.map((error: any) => { return <p>{error}</p> })} </div>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-group">
                                <p>پلاک خودرو   </p>


                                <PlaqueInput
                                    disabled={disabled}
                                    inputRef={plaqueRef}
                                    small={true}
                                    onChange={handle_plaqueChange}
                                    value={convertStringToPlaque(fields?.plaque ? fields?.plaque : '')}
                                />
                                {validateErrors['plaque']?.length > 0 &&
                                    <>
                                        <div className='validate'>
                                            <i className='fa fa-exclamation-triangle'></i>
                                            <div className='error-msg'> {validateErrors['plaque']?.map((error: any) => { return <p>{error}</p> })} </div>
                                        </div>
                                    </>
                                }
                                {/* <input disabled={disabled} onChange={(e) => setFields({ ...fields, plaque: e.target.value })} value={fields?.plaque || ''} type="text" className="form-control" /> */}
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-group">
                                <p>تصویر روی کارت خودرو   </p>
                                <div className="file-upload-div">
                                    <FileUpload
                                        disabled={disabled}
                                        ref={fileUploadRef_rooyeCartKhodro}
                                        name={'rooyeCartKhodro'} id={objectId.toString()} handleGetBase64={handleGetBase64} />
                                    {fields?.extra?.attachFile?.rooyeCartKhodro && <i className='fa fa-eye my-eye-icon' onClick={() => showAttachImage('rooyeCartKhodro')}></i>}
                                </div>
                                {validateErrors['extra.attachFile.rooyeCartKhodro']?.length > 0 &&
                                    <>
                                        <div className='validate'>
                                            <i className='fa fa-exclamation-triangle'></i>
                                            <div className='error-msg'> {validateErrors['extra.attachFile.rooyeCartKhodro']?.map((error: any) => { return <p>{error}</p> })} </div>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-group">
                                <p>تصویر پشت کارت خودرو   </p>
                                <div className="file-upload-div">
                                    <FileUpload
                                        disabled={disabled}
                                        ref={fileUploadRef_poshtCartKhodro}
                                        name={'poshtCartKhodro'} id={objectId.toString()} handleGetBase64={handleGetBase64} />
                                    {fields?.extra?.attachFile?.poshtCartKhodro && <i className='fa fa-eye my-eye-icon' onClick={() => showAttachImage('poshtCartKhodro')}></i>}
                                </div>
                                {validateErrors['extra.attachFile.poshtCartKhodro']?.length > 0 &&
                                    <>
                                        <div className='validate'>
                                            <i className='fa fa-exclamation-triangle'></i>
                                            <div className='error-msg'> {validateErrors['extra.attachFile.poshtCartKhodro']?.map((error: any) => { return <p>{error}</p> })} </div>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-group">
                                <p>تصویر برگ سبز    </p>
                                <div className="file-upload-div">
                                    <FileUpload
                                        disabled={disabled}
                                        ref={fileUploadRef_bargeSabz}
                                        name={'bargeSabz'} id={objectId.toString()} handleGetBase64={handleGetBase64} />
                                    {fields?.extra?.attachFile?.bargeSabz && <i className='fa fa-eye my-eye-icon' onClick={() => showAttachImage('bargeSabz')}></i>}
                                </div>
                                {validateErrors['extra.attachFile.bargeSabz']?.length > 0 &&
                                    <>
                                        <div className='validate'>
                                            <i className='fa fa-exclamation-triangle'></i>
                                            <div className='error-msg'> {validateErrors['extra.attachFile.bargeSabz']?.map((error: any) => { return <p>{error}</p> })} </div>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-group">
                                <p>تصویر بیمه   </p>
                                <div className="file-upload-div">
                                    <FileUpload
                                        disabled={disabled}
                                        ref={fileUploadRef_bime}
                                        name={'bime'} id={objectId.toString()} handleGetBase64={handleGetBase64} />
                                    {fields?.extra?.attachFile?.bime && <i className='fa fa-eye my-eye-icon' onClick={() => showAttachImage('bime')}></i>}
                                </div>
                                {validateErrors['extra.attachFile.bime']?.length > 0 &&
                                    <>
                                        <div className='validate'>
                                            <i className='fa fa-exclamation-triangle'></i>
                                            <div className='error-msg'> {validateErrors['extra.attachFile.bime']?.map((error: any) => { return <p>{error}</p> })} </div>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-group">
                                <p>تصویر معاینه فنی   </p>
                                <div className="file-upload-div">
                                    <FileUpload
                                        disabled={disabled}
                                        ref={fileUploadRef_moayeneFanni}
                                        name={'moayeneFanni'} id={objectId.toString()} handleGetBase64={handleGetBase64} />
                                    {fields?.extra?.attachFile?.moayeneFanni && <i className='fa fa-eye my-eye-icon' onClick={() => showAttachImage('moayeneFanni')}></i>}
                                </div>
                                {validateErrors['extra.attachFile.moayeneFanni']?.length > 0 &&
                                    <>
                                        <div className='validate'>
                                            <i className='fa fa-exclamation-triangle'></i>
                                            <div className='error-msg'> {validateErrors['extra.attachFile.moayeneFanni']?.map((error: any) => { return <p>{error}</p> })} </div>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="form-group">
                                <button disabled={Object.keys(validateErrors).length === 0 ? disabled : true}
                                    onClick={() => handleClick(InsertOrUpdate === 'insert' ? 'insert' : 'update')}
                                    className={`my-btn ${disabled === false && Object.keys(validateErrors).length === 0 ? '' : 'inactive'}`}>
                                    {InsertOrUpdate === 'insert' ? 'ثبت' : 'بروز رسانی'}</button>
                                <button disabled={disabled} onClick={() => clearFormInputs()}
                                    className={`my-btn ${disabled === false ? '' : 'inactive'}`}>انصراف</button>
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    );
};

export default AganceVehicle;