import React, { useEffect, useRef, useState } from 'react';
import './style.scss'
import moment from 'jalali-moment';
import FileDeleter from '../../../components/FileUpload/FileDeleter';
import useAganceDriver from '../../../hooks/data/Agance/useAganceDriver';
import WordProcessor from '../../../components/Exports/WordProcessor/WordProcessor';
import wordFile from '../../../lib/zarghan/estelamate3gane.docx';
import { FileUploadHandles } from '../../../components/FileUpload/FileUpload';
import { getBase64WithFileName } from '../../../utils/utils';

import useAuthentication from '../../../hooks/data/useAuthentication';
import * as permitConstant from '../../../lib/constants'

const Estehamhaye3gane = ({ handleBackClick, title }: any) => {

    title = `استعلام های 3 گانه(تایید گواهینامه ، تشخیص هویت ، مرکز بهداشت)  `

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
                if (permission === permitConstant.PERMIT_AGANCE_ESTELAMHAYE_SE_GANE_CREATE) {
                    newPermit.CREATE = true
                }
                if (permission === permitConstant.PERMIT_AGANCE_ESTELAMHAYE_SE_GANE_EDIT) {
                    newPermit.EDIT = true
                    thead_crud += '- update -'
                }
                if (permission === permitConstant.PERMIT_AGANCE_ESTELAMHAYE_SE_GANE_DELETE) {
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

    const { result: resulAgancetDriver } = useAganceDriver('select', null)

    useEffect(() => {
        console.log(7);
        
        if (resulAgancetDriver) {
            console.log(8,resulAgancetDriver?.data?.data);
            setAganceDriversList(resulAgancetDriver?.data?.data)
        }
    }, [resulAgancetDriver])

    useEffect(() => {
    }, [fields,aganceDriversList])



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

    return (
        <div className='aganceRegister-component'>

            {handleBackClick && <i className='fa fa-arrow-left back-icon' onClick={handleBackClick}></i>}

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

                        <select onChange={async (e) => {
                            const driver = aganceDriversList.filter((ite: any) => ite?.details?.nat_num === e.target.value && ite?.details?.nat_num !== null && ite?.details?.nat_num !== undefined)[0]

                            console.log(141);

                            setFields({
                                full_name: driver?.full_name,
                                fatherName: driver?.details?.fatherName,
                                nat_num: driver?.details?.nat_num,
                                shomare_shenasname: driver?.details?.shomare_shenasname,
                                sadere: driver?.details?.sadere,
                                image_driverPic: await getBase64WithFileName(driver?.details?.attachFile?.driverPic)
                            });
                        }
                        }
                            className='form-control' value={fields?.nat_num as string || "1"}>
                            <option value="1">---انتخاب کنید---</option>
                            {aganceDriversList.map((driver: any) => {
                                if (driver.status === 'ACTIVE') {
                                    return <option value={driver?.details?.nat_num}>{driver?.full_name}</option>
                                }
                            })}
                        </select>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        {fields?.nat_num
                            && <>
                                <WordProcessor autoReadFile={true} wordFile={wordFile}
                                    fields={fields}
                                />
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Estehamhaye3gane;