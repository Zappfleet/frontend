import React, { useEffect, useRef, useState } from 'react';
import './style.scss'
import moment from 'jalali-moment';
import FileDeleter from '../../../components/FileUpload/FileDeleter';
import useAganceDriver from '../../../hooks/data/Agance/useAganceDriver';
import WordProcessor from '../../../components/Exports/WordProcessor/WordProcessor';
import wordFile from '../../../lib/zarghan/estelameAmaken.docx';

// import htmlFile from '../../../lib/zarghan/estelameAmaken.htm';
import { FileUploadHandles } from '../../../components/FileUpload/FileUpload';
import { convertToJalaliDateTiem, getBase64WithFileName } from '../../../utils/utils';

import useAuthentication from '../../../hooks/data/useAuthentication';
import * as permitConstant from '../../../lib/constants'
import ErrorBoundary from '../../../components/ErrorBoundary/ErrorBoundary';
import HTMLProcessor from '../../../components/Exports/HTMLProcessor/HTMLProcessor';

const EstelamAmaken = ({ handleBackClick, title }: any) => {

    const [htmlFile, sethtmlFile] = useState<any>(null)
    useEffect(() => {
        fetch('/zarghanFiles/estelameAmaken.htm')
            .then(response => response.text())
            .then(data => {
                sethtmlFile(data)
            })
            .catch(err => console.error(err));
    }, []);

    title = 'استعلام اداره اماکن'


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

    const { result: resulAgancetDriver } = useAganceDriver('select', null)

    useEffect(() => {
        if (resulAgancetDriver) {
            console.log(441,resulAgancetDriver);
            
            setAganceDriversList(resulAgancetDriver?.data?.data)
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

    return (
        <div className='aganceCarteSalahiyat-component'>

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


                            //</div> 

                            const nat_num = driver?.details?.nat_num || ' '; // نام پدر
                            let natNum_slice: any = {};
                            // اضافه کردن کاراکترهای نام پدر به فیلدهای ni1 تا ni10
                            for (let i = 0; i < 30; i++) {
                                if (i < nat_num?.length) {
                                    natNum_slice[`n${i + 1}`] = nat_num[i];
                                } else {
                                    natNum_slice[`n${i + 1}`] = ' '; // اگر تعداد کاراکترها کمتر از 10 باشد، با "" پر می‌شود
                                }
                            }


                            const name = driver?.details?.name || ' '; // نام پدر
                            let name_slice: any = {};
                            // اضافه کردن کاراکترهای نام پدر به فیلدهای ni1 تا ni10
                            for (let i = 0; i < 30; i++) {
                                if (i < name?.length) {
                                    name_slice[`nn${i + 1}`] = name[i];
                                } else {
                                    name_slice[`nn${i + 1}`] = ' '; // اگر تعداد کاراکترها کمتر از 10 باشد، با "" پر می‌شود
                                }
                            }


                            const family = driver?.details?.family || ' '; // نام پدر
                            let familly_slice: any = {};
                            // اضافه کردن کاراکترهای نام پدر به فیلدهای ni1 تا ni10
                            for (let i = 0; i < 30; i++) {
                                if (i < family?.length) {
                                    familly_slice[`ln${i + 1}`] = family[i];
                                } else {
                                    familly_slice[`ln${i + 1}`] = ' '; // اگر تعداد کاراکترها کمتر از 10 باشد، با "" پر می‌شود
                                }
                            }

                            const pic = await getBase64WithFileName(driver?.details?.attachFile?.driverPic)
                            // استفاده از setFields برای تنظیم فیلدها

                            console.log(45, pic);

                            setFields({
                                full_name: driver?.full_name || '',
                                name: name || '',
                                familly: family || '',
                                din: driver?.details?.din || '',
                                taahol: driver?.details?.taahol || '',
                                cell_phone: driver?.details?.cellPhone || '',
                                code_posti: driver?.details?.postalCode || '',
                                nic_name: driver?.details?.nikName || '',
                                phone: driver?.details?.homePhone || '',
                                b_d: driver?.details?.birthDate ? (convertToJalaliDateTiem(driver?.details?.birthDate))?.split(" ")[0] : '',
                                sh_seri: driver?.details?.shomare_shenasname || '',
                                gender: driver?.details?.gender || '',
                                madrak: driver?.details?.madrakeTahsili || '',
                                shomare_cart: driver?.details?.shomareKartePayanKhedmat || '',
                                nezame_vazife: driver?.details?.shomareKartePayanKhedmat ? 'پایان خدمت' : '---',
                                father_name: driver?.details?.fatherName || ' ',
                                address: driver?.details?.address || ' ',
                                mahale_tavallod: '---',
                                pelake_khodro: driver?.vehicles[0]?.plaque,
                                factor_num: '---',
                                factor_date: '---',
                                isMiss: driver?.details?.gender === 'زن' ? 'خانم' : 'آقای',
                                // address: driver?.details?.address || ' ',
                                // address: driver?.details?.address || ' ',
                                //  address: driver?.details?.address || ' ',
                                nat_num: nat_num || ' ',
                                sh_sh: driver?.details?.shomare_shenasname || ' ',
                                sadere: driver?.details?.sadere || ' ',
                                pic: `<img src='${pic}' width="100px" height='100px'/>`,
                                pic1: await getBase64WithFileName(driver?.details?.attachFile?.driverPic) || ' ',
                                ...natNum_slice, // اضافه کردن فیلدهای جدید ni1 تا ni10
                                ...name_slice,
                                ...familly_slice
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

export default EstelamAmaken;