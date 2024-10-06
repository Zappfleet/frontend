import React, { useEffect, useRef, useState } from 'react';
import './style.scss';
import '../aganceRegister/style.scss'
import ObjectId from 'bson-objectid';
import FileUpload, { FileUploadHandles } from '../../../components/FileUpload/FileUpload';
import { NotificationController } from '../../../lib/notificationController';
import DataGrid from '../../../components/DataGrid/DataGrid';
import useTarefeAvarez from '../../../hooks/data/Agance/useTarefeAvarez';
import useAuthentication from '../../../hooks/data/useAuthentication';
import * as permitConstant from '../../../lib/constants'
import Page403 from '../../../components/Page403/Page403';
import ErrorBoundary from '../../../components/ErrorBoundary/ErrorBoundary';



interface TarefeAvarez {
    _id: string,
    id: string,
    year?: string,
    sodureCaretSalahiyat?: string,
    tamdidCaretSalahiyat?: string,
    sodureParvaneAgance?: string,
    AvarezaSaliyaneAgance?: string,
    karshenasiParvande?: string,
    status?: string,
    attachFile?: {
        madarek?: string;
    }
}
const RegisterTarefeAvarez = ({ handleBackClick, title }: any) => {

    title = 'ثبت تعرفه عوارض'
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
                if (permission === permitConstant.PERMIT_AGANCE_TAREFE_AVAREZ_CREATE) {
                    newPermit.CREATE = true
                }
                if (permission === permitConstant.PERMIT_AGANCE_TAREFE_AVAREZ_EDIT) {
                    newPermit.EDIT = true
                    thead_crud += '- update -'
                }
                if (permission === permitConstant.PERMIT_AGANCE_TAREFE_AVAREZ_DELETE) {
                    newPermit.DELETE = true
                    thead_crud += '- delete -'
                }
            })
        })
        setPermit(newPermit)
        setTheadCRUD(thead_crud)
    }, [authInfo])
    const fileUploadRef_madarek = useRef<FileUploadHandles>(null);

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

    const [imagesBase64, setImagesBase64] = useState<any>({});
    const [fields, setFields] = useState<Partial<TarefeAvarez>>({});


    const options = [{ id: 1, value: 10 }, { id: 2, value: 30 }, { id: 3, value: 50 }]
    const thead = [
        // { key: 'id', name: 'شناسه' },
        { key: '', name: theadCRUD },
        { key: 'year', name: 'سال', img: false },
        // { key: 'shomareParvane', name: ' تاریخ شروع  فعالیت', type: 'caleadar', key2: 'fromdate' },
    ]

    const [ItemsList, setItemsList] = useState<any[]>([])
    const [OriginalItems, setOriginalItems] = useState<any[]>([])

    const { result, type: respType, state, refreshData } = useTarefeAvarez(action_name, fields)


    useEffect(() => {
        if (result) {
            switch (respType) {
                case 'insert':
                    if (result?.status === 200) {
                        NotificationController.showSuccess('تعرفه عوارض ثبت شد')
                        setActionName('select')
                    }
                    else {
                        NotificationController.showError('  تعرفه عوارض ثبت نشد')
                    }
                    break;
                case 'update':
                    if (result?.status === 200) {
                        NotificationController.showSuccess('تعرفه عوارض ویرایش شد')
                        setActionName('select')
                    }
                    else {
                        NotificationController.showError('تعرفه عوارض ویرایش نشد')
                    }
                    break;
                case 'delete':
                    if (result?.status === 200) {
                        NotificationController.showSuccess('تعرفه عوارض حذف شد')
                        setActionName('select')
                    }
                    else {
                        NotificationController.showError('تعرفه عوارض حذف نشد')
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

        clearAllFileUpload()

        setShowAttchImage(false)
        setAttchImageSrc('')
        objectIdRef.current = new ObjectId();
        setFields({})
        setImagesBase64({})
        setActionName(null)
        setInsertOrUpdate('insert')
    }

    const clearAllFileUpload = () => {
        clearFileUpload('madarek')
    }

    // const handleChangeFishDate = (date: any) => {
    //     setFishDateDatePicker(date);
    //     setFishDate(date.format('YYYY/MM/DD', { calendar: 'persian', locale: 'fa' }))
    //     setFields({ ...fields, fishDate: convertDateToISO(persianDateToGregorian(date.format('YYYY/MM/DD', { calendar: 'persian', locale: 'fa' }))) })
    // }



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
        console.log(741, imagesBase64);
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

    const clickOnRowDataGrid = (item: TarefeAvarez, type: any) => {

        if (type === 'delete') {
            setFields(item)
            setActionName('delete')
        }
        if (type === 'update') {

            clearAllFileUpload()

            const updateItem: TarefeAvarez = (OriginalItems.filter((e: any) => e._id === item._id))[0]

            updateItem?.attachFile?.madarek && fileUploadRef_madarek.current?.setFileInput(updateItem?.attachFile?.madarek)


            setFields(updateItem)
            setInsertOrUpdate('update')
        }
    }

    useEffect(() => {
    }, [fields])


    useEffect(() => {
    }, [attchImageSrc])

    const showAttachImage = (name: any) => {
        setAttchImageSrc(imagesBase64[name])
        setShowAttchImage(true)
    }

    return (

        <div className='RegisterTarefeAvarez-component agance-component'>
            {handleBackClick && <i className='fa fa-arrow-left back-icon' onClick={handleBackClick}></i>}


            {showAttchImage && <div className="myAttachImage">
                <img className="upload-img" src={attchImageSrc} />
                <i className='fa fa-remove close-icon' onClick={() => { setShowAttchImage(false), setAttchImageSrc('') }}></i>
            </div>}


            <div className="row">
                <div className="col-12">
                    <div className="page-title">
                        <i onClick={() => { setSelectedTab('list'); }} className={selectedTab === 'list' ? 'active' : ''}>{'لیست تعرفه عوارض '}</i>
                    </div>
                    <div className="page-title">
                        <i onClick={() => { setSelectedTab('insert'); }} className={selectedTab === 'insert' ? 'active' : ''}>{InsertOrUpdate === 'insert' ? title : 'بروزرسانی تعرفه عوارض '}</i>
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
                        <div className="row">

                            <div className="col-12">
                                {InsertOrUpdate === 'update' && <button onClick={() => { clearFormInputs(); setInsertOrUpdate('insert') }} className='my-btn'>{title}</button>}
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p> سال  </p>
                                    <select onChange={(e) => setFields({ ...fields, year: e.target.value })}
                                        className='form-control' value={fields?.year as string || "1"}>
                                        <option value="1">---انتخاب کنید---</option>
                                        <option value="1400">1400</option>
                                        <option value="1401">1401</option>
                                        <option value="1402">1402</option>
                                        <option value="1403">1403</option>
                                        <option value="1404">1404</option>
                                        {/* {ItemsList.map((item: any) => {
                                    if (item?.year) {
                                        return <option value={item?.year}>{item?.year}</option>
                                    }
                                })} */}
                                    </select>
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p> صدور کارت صلاحیت (ریال)</p>
                                    <input onChange={(e) => setFields({ ...fields, sodureCaretSalahiyat: e.target.value.replace(/,/g, '') })} value={fields?.sodureCaretSalahiyat?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || ''} type="text" className="form-control" />

                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p> تمدید کارت صلاحیت (ریال)</p>
                                    <input onChange={(e) => setFields({ ...fields, tamdidCaretSalahiyat: e.target.value.replace(/,/g, '') })} value={fields?.tamdidCaretSalahiyat?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || ''} type="text" className="form-control" />
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>صدور پروانه آژانس (ریال)</p>
                                    <input onChange={(e) => setFields({ ...fields, sodureParvaneAgance: e.target.value.replace(/,/g, '') })} value={fields?.sodureParvaneAgance?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || ''} type="text" className="form-control" />
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p>عوارض سالیانه آژانس (ریال)</p>
                                    <input onChange={(e) => setFields({ ...fields, AvarezaSaliyaneAgance: e.target.value.replace(/,/g, '') })} value={fields?.AvarezaSaliyaneAgance?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || ''} type="text" className="form-control" />
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p> کارشناسی پرونده (ریال)</p>
                                    <input onChange={(e) => setFields({ ...fields, karshenasiParvande: e.target.value.replace(/,/g, '') })} value={fields?.karshenasiParvande?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || ''} type="text" className="form-control" />
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <p> بارگزاری مدارک مصوب نرخ</p>
                                    <div className="file-upload-div">
                                         
                                            <FileUpload
                                            ref={fileUploadRef_madarek}
                                            name={'madarek'}
                                            id={objectId.toString()}
                                            handleGetBase64={handleGetBase64} /> 
                                         
                                       
                                        {fields?.attachFile?.madarek &&
                                            <i className='fa fa-eye my-eye-icon' onClick={() => showAttachImage('madarek')}></i>}
                                    </div>
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

export default RegisterTarefeAvarez;