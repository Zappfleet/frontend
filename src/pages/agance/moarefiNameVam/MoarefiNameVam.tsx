
import React, { useEffect, useRef, useState } from 'react';
import './style.scss'
import moment from 'jalali-moment';
import FileDeleter from '../../../components/FileUpload/FileDeleter';
import useAganceDriver from '../../../hooks/data/Agance/useAganceDriver';

import useAuthentication from '../../../hooks/data/useAuthentication';
import * as permitConstant from '../../../lib/constants'
import HTMLProcessor from '../../../components/Exports/HTMLProcessor/HTMLProcessor';
import { convertGregorianToJalali } from '../../../utils/utils';
import { NotificationController } from '../../../lib/notificationController';

const MoarefiNameVam = ({ }) => {

    const [htmlFile, sethtmlFile] = useState<any>(null)
    const [mablagh, setMablagh] = useState<any>()
    useEffect(() => {
        fetch('/zarghanFiles/vam/vam.htm')
            .then(response => response.text())
            .then(data => {
                sethtmlFile(data)
            })
            .catch(err => console.error(err));
    }, []);

    const title = 'معرفی نامه وام'


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
                if (permission === permitConstant.PERMIT_AGANCE_ESTELAM_AMAKEN_CREATE) {
                    newPermit.CREATE = true
                }
                if (permission === permitConstant.PERMIT_AGANCE_ESTELAM_AMAKEN_EDIT) {
                    newPermit.EDIT = true
                    thead_crud += '- update -'
                }
                if (permission === permitConstant.PERMIT_AGANCE_ESTELAM_AMAKEN_DELETE) {
                    newPermit.DELETE = true
                    thead_crud += '- delete -'
                }
            })
        })
        setPermit(newPermit)
        setTheadCRUD(thead_crud)
    }, [authInfo])

    const [aganceDriversList, setAganceDriversList] = useState<any[]>([])

    const [fields, setFields] = useState<any>({})

    const [action, setAction] = useState<any>('select')
    const [selectedDriver, setSelectedDriver] = useState<any>(null)
    const { result: resulAgancetDriver, type: resultType } = useAganceDriver(action, selectedDriver)


    useEffect(() => {
        if (resulAgancetDriver) {
            switch (resultType) {
                case 'select':
                    setAganceDriversList(resulAgancetDriver?.data?.data)
                    break;
                case 'update':

                    setSelectedDriver(null)
                    setAction('select')
                    console.log(41, resulAgancetDriver);

                    resulAgancetDriver?.data?.status == 200 && NotificationController.showSuccess('اطلاعات ثبت شد')
                    resulAgancetDriver?.data?.status != 200 && NotificationController.showError('اطلاعات ثبت نشد')
                    break;
            }
        }
    }, [resulAgancetDriver])



    useEffect(() => {
    }, [fields])



    const [fromDateDatePicker, setFromDateDatePicker] = useState<any>(moment(new Date()).format('jYYYY/jMM/jDD'));
    const [fromDate, setFromDate] = useState<any>(moment(new Date()).format('jYYYY/jMM/jDD'));

    const [showAlert, setShowAlert] = useState<any>(false)
    const handleChangeDatePickerFromDate = (date: any) => {
        setFromDateDatePicker(date);
        setFromDate(date.format('YYYY/MM/DD', { calendar: 'persian', locale: 'fa' }))
    }

    const [imageFileNmae, setImageFileNmae] = useState('');
    const [imageBase64, setImageBase64] = useState('');
    const [ticketFields, setTichetFields] = useState({
        id: Math.floor(10000 + Math.random() * 90000),
        title: '',
        description: '',
        attachFileName: '',
        status: 'open',
        createDate: new Date()
    })
    const handleGetBase64 = (base64: any, fileName: any) => {
        deleteOldFile().then(() => {
            setImageFileNmae(fileName)
            setImageBase64(base64)
            setTichetFields(prev => ({ ...prev, attachFileName: fileName }))
        })
    }
    const deleteOldFile = async () => {
        if (imageFileNmae !== '') {
            const url = import.meta.env.VITE_ENVIRONMENT_NAME === 'local' ?
                import.meta.env.VITE_BASE_URL : import.meta.env.VITE_BASE_URL_SERVER
            FileDeleter.FileDeleter(url, imageFileNmae)
        }
    }


    useEffect(() => {
        setFields({ ...fields, mablagh: mablagh?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || '---' })
    }, [mablagh])

    const handleChangeDriver = (e: any) => {

        const driver = aganceDriversList.filter((ite: any) => ite?.details?.nat_num === e.target.value && ite?.details?.nat_num !== null && ite?.details?.nat_num !== undefined)[0]
        driver && setSelectedDriver(driver)

        setFields({
            full_name: driver?.full_name || '---',
            father_name: driver?.details?.fatherName || '---',
            nat_num: e.target.value,
            sadere: driver?.details?.sadere || '---',
            mablagh: mablagh?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || '---'
        })
    }

    const handleSaveInArchive = () => {

        const x = {
            ...selectedDriver,
            details: {
                ...(selectedDriver?.details || {}),
                activityArchive: [...selectedDriver?.details?.activityArchive || [],
                {
                    name: 'درخواست وام ',
                    date: new Date().toISOString(), // افزودن اطلاعات راننده به آبجکت جدید
                }
                ],
            },
        }

        // //console.log(455, selectedDriver, x);
        setSelectedDriver(x)
        setAction('update')
    }
    return (
        <div className='aganceCarteSalahiyat-component'>
            <div className="row">
                <div className="col-12">
                    <div className="page-title">
                        <i>{title}</i>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="form-group">
                        <span>    {`کد ملی را وارد کنید`}   </span>

                        <select onChange={(e) => handleChangeDriver(e)}
                            className='form-control' value={fields?.nat_num as string || "1"}>
                            <option value="1">---انتخاب کنید---</option>
                            {aganceDriversList?.map((driver: any) => {
                                //  if (driver.status === 'ACTIVE') {
                                return <option value={driver?.details?.nat_num}>{driver?.full_name}</option>
                                // }
                            })}
                        </select>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <span>مبلغ وام را وارد کنید (ریال)</span>
                        <input onChange={(e) => setMablagh(e.target.value.replace(/,/g, ''))} value={mablagh?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} type="text" className="form-control" />
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        {fields?.nat_num && htmlFile !== null &&
                            <>
                                <br />
                                <button onClick={() => handleSaveInArchive()}
                                    className='my-btn'
                                >ذخیره در بایگانی </button>

                                <HTMLProcessor autoReadFile={true} HTMLFile={htmlFile}
                                    fields={fields} />
                            </>
                        }
                    </div>
                </div>
            </div>
        </div >
    );
};

export default MoarefiNameVam;