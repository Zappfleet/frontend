import React, { useEffect, useRef, useState } from 'react';
import './style.scss'
import moment from 'jalali-moment';
import FileDeleter from '../../../components/FileUpload/FileDeleter';
import useAganceDriver from '../../../hooks/data/Agance/useAganceDriver';

import useAuthentication from '../../../hooks/data/useAuthentication';
import * as permitConstant from '../../../lib/constants'
import HTMLProcessor from '../../../components/Exports/HTMLProcessor/HTMLProcessor';
import useCarteSalahiyat from '../../../hooks/data/Agance/useCarteSalahiyat';
import { convertGregorianToJalali } from '../../../utils/utils';

const BimeNameTaminEjtemaei = ({ }) => {

    const [htmlFile, sethtmlFile] = useState<any>(null)
    useEffect(() => {
        fetch('/zarghanFiles/bime_name_tamin_ejtemaei/bime_name_tamin_ejtemaei.htm')
            .then(response => response.text())
            .then(data => {
                sethtmlFile(data)
            })
            .catch(err => console.error(err));
    }, []);

    const title = 'معرفی نامه اداره تامین اجتماعی'


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
    const [aganceCarteSalahiyat, setAganceCarteSalahiyat] = useState<any[]>([])

    const [fields, setFields] = useState<any>({})

    const { result: resulAgancetDriver } = useAganceDriver('select', null)
    const { result: resultCarteSalahiyat } = useCarteSalahiyat('select', null)

    useEffect(() => {
        if (resulAgancetDriver) {
            setAganceDriversList(resulAgancetDriver?.data?.data)
        }
    }, [resulAgancetDriver])

    useEffect(() => {
        if (resultCarteSalahiyat) {
            console.log(2000, resultCarteSalahiyat);

            setAganceCarteSalahiyat(resultCarteSalahiyat?.data?.data)
        }
    }, [resultCarteSalahiyat])

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

    const handleChangeDriver = (e: any) => {
        console.log(200, e.target.value, aganceDriversList);




        const driver = aganceDriversList.filter((ite: any) => ite?.details?.nat_num === e.target.value && ite?.details?.nat_num !== null && ite?.details?.nat_num !== undefined)[0]
        const driverCart = aganceCarteSalahiyat.filter((ite: any) => ite?.driverNatNum === e.target.value && ite?.driverNatNum !== null && ite?.driverNatNum !== undefined)[0]

        console.log(301, driverCart);

        setFields({
            name: driver?.full_name || '---',
            father_name: driver?.details?.fatherName || '---',
            carteSalahiyat_num: driverCart?.fishNumber || '---',
            from_date: (driverCart?.fromDate && convertGregorianToJalali(driverCart?.fromDate)) || '---',
            to_date: (driverCart?.toDate && convertGregorianToJalali(driverCart?.toDate)) || '---',

            nat_num: e.target.value
        })
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
                        {fields?.nat_num && htmlFile !== null &&
                            <>
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

export default BimeNameTaminEjtemaei;