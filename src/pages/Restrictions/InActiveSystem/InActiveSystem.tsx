import React, { Children, useEffect, useState } from 'react';
import '../../Reports/TimeOfServices/Style.scss';
import './InActiveStyle.scss';

import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import jMoment from 'jalali-moment'
import moment from 'moment'

import useInactiveSystem from '../../../hooks/data/Restrictions/useInactiveSystem.js';

import {
    persianDateToGregorian,
    secondsToHMS,
    convertToJalaliDateTiem,
    convertPersianToEnglishDigits,
    translateAction,
    convertToJalali, convertGregorianToJalali

} from '../../../utils/utils.js';
import TreeView from '../../../components/TreeView.js';


import usePermissions from '../../../hooks/data/usePermissions';
import TreeNode from './TreeNode.js';

const InActiveSystem: React.FC = () => {


    const [fromDateDatePicker, setFromDateDatePicker] = useState<any>(moment(new Date()).format('jYYYY/jMM/jDD'));
    const [toDateDatePicker, setToDateDatePicker] = useState<any>(moment(new Date()).format('jYYYY/jMM/jDD'));

    const [fromDate, setFromDate] = useState<any>(jMoment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSSZ'));
    const [toDate, setToDate] = useState<any>(jMoment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSSZ'));

    const [fromDatechanded, setFromDatechanged] = useState<any>(false);
    const [toDatechanded, setToDatechanged] = useState<any>(false);

    const { data } = usePermissions();

    useEffect(() => {
        console.log('fromDateDatePicker:', fromDateDatePicker);
        //  console.log('To Date:', toDate);
    }, [fromDate, toDate, fromDateDatePicker, toDateDatePicker]);

    const [items, setItems] = useState<any>(null)
    const [action_name, setAction_name] = useState<any>('select')
    const [title, setTitle] = useState<any>(null)
    const [item, setItem] = useState<any>(null)
    const [execute, setExecute] = useState<any>(null)
    const { missionList, state, refreshData } = useInactiveSystem(action_name, item);
    const [checked, setChecked] = useState<any>([]);

    useEffect(() => {
        if (missionList) {
            if (missionList.status === 200) {
                //  console.log(4444, missionList.data);
                setItems(missionList.data.data)
            }
            if (missionList.status === 403) {
                //  setForbidden(true)
            }
        }
    }, [missionList])


    const handleChangeDatePickerFromDate = (date: any) => {
        setFromDateDatePicker(date);
        const gregorianDate = convertToJalali(date.year, date.month.number, date.day)
        setFromDate(gregorianDate);
        setFromDatechanged(true)
    };

    const handleChangeDatePickerTodate = (date: any) => {
        setToDateDatePicker(date);
        const gregorianDate = convertToJalali(date.year, date.month.number, date.day)
        setToDate(gregorianDate)
        setToDatechanged(true)
    };

    useEffect(() => {
        //   console.log(42, fromDate,);
    }, [fromDate, toDate])




    // const handleChangeDatePickerFromDate = (date: any) => {

    //     setFromDateDatePicker(date);
    //     setFromDate(date.format('YYYY/MM/DD', { calendar: 'persian', locale: 'fa' }))
    // };

    // const handleChangeDatePickerTodate = (date: any) => {
    //     setToDateDatePicker(date);
    //     setToDate(date.format('YYYY/MM/DD', { calendar: 'persian', locale: 'fa' }))
    // };

    const handleInsert = () => {
        clear()
        setAction_name('insert')
    }

    const [updateid, setUpdateID] = useState<any>(-1)
    const handleUpdate = (item: any) => {

        setAction_name('update')
        setChecked(item.inactive_permissions)
        setTitle(item.title)
        setFromDateDatePicker(convertGregorianToJalali(item.start_date))
        setToDateDatePicker(convertGregorianToJalali(item.end_date))
        setUpdateID(item._id)

    }
    const handleDelete = async (item: any) => {
        // console.log(888,item._id);

        setItem(item._id)
        setAction_name('delete')
        await refreshData()
        refreshPage()
    }

    const refreshPage = async () => {
        setItem(null)
        setAction_name('select')
        await refreshData()
        clear()
    }

    const handleSave = async () => {
        if (action_name === 'insert') {
            let ite = {}
            ite = {
                title: title,
                status: "ACTIVE",
                start_date: fromDate,
                end_date: toDate,
                inactive_permissions: checked
            }
            console.log(1, ite);

            setItem(ite)
        }

        if (action_name === 'update') {
            let ite: any
            ite = {
                _id: updateid,
                title: title,
                status: "ACTIVE",
                inactive_permissions: checked
            }
            if (fromDatechanded === true) {
                ite.start_date = fromDate;
            }
            if (toDatechanded === true) {
                ite.end_date = toDate;
            }

            setItem(ite)
        }


        await refreshData()
        refreshPage()
    }

    const [PermissionSet, setPermissionSet] = useState<any>(null)

    useEffect(() => {
        // console.log(200, data.permissions);
        setPermissionSet(data.permissions)
    }, [data])

    useEffect(() => {
        refreshPage()
        // setAction_name('')
    }, [])

    // PermissionTree Component



    const handleCheckboxChange = (path: string, isChecked: boolean) => {
        setChecked((prevChecked: any) =>
            isChecked
                ? [...prevChecked, path]
                : prevChecked.filter((item: any) => item !== path)
        );

        //  console.log(122, checked);

    };


    const ShowlistOfItems = items && items.map((item: any, index: any) => {
        return (<div className='listofitems' key={index}>
            <span className='title'>{item.title}</span>
            <i onClick={() => handleUpdate(item)} className='i1 fa fa-edit'></i>
            <i onClick={() => handleDelete(item)} className='i2 fa fa-trash'></i>
        </div>)
    })

    const clear = () => {
        // console.log(9);

        setFromDateDatePicker(moment(new Date()).format('jYYYY/jMM/jDD'))
        setToDateDatePicker(moment(new Date()).format('jYYYY/jMM/jDD'));
        setFromDate(moment(new Date()).format('jYYYY/jMM/jDD'));
        setToDate(moment(new Date()).format('jYYYY/jMM/jDD'));
        setFromDatechanged(false)
        setToDatechanged(false)
        setAction_name('insert')
        setTitle('')
        setItem(null)
        setChecked([])
    }
    //////////////////////////////
    return (
        <div className='inactive-page'>
            <div className="report-component">
                <div className="filter-items">
                    <div className="row">
                        <div className="col-3">
                            <div className="right">
                                <button onClick={() => handleInsert()} className='form-control'>ایجاد</button>
                                {ShowlistOfItems}
                            </div>
                        </div>
                        <div className="col-9">
                            <div className="row">
                                <div className="col-12 col-md-3">
                                    از تاریخ
                                    <DatePicker
                                        onChange={(date) => handleChangeDatePickerFromDate(date !== null ? (Array.isArray(date) ? date[0] : date) : null)}
                                        calendar={persian}
                                        locale={persian_fa}
                                        className="datetime-picker"
                                        inputClass="datetime-input !text-center !text-lg !p-4"
                                        value={fromDateDatePicker}
                                        placeholder='از تاریخ'
                                    />


                                    {/* <input type="text" className="form-control" id="fromdate" placeholder='از تاریخ' /> */}
                                </div>
                                <div className="col-12 col-md-3">
                                    تا تاریخ
                                    <DatePicker
                                        onChange={handleChangeDatePickerTodate}
                                        calendar={persian}
                                        locale={persian_fa}
                                        className="datetime-picker"
                                        inputClass="datetime-input !text-center !text-lg !p-4"
                                        value={toDateDatePicker}
                                        placeholder='تا تاریخ'
                                    />
                                </div>
                                <div className="col-12 col-md-3">
                                    <br />
                                    <button onClick={() => handleSave()} className="btn btn-search" type="submit">
                                        {action_name === 'update' ? 'بروزرسانی' : 'ایجاد'}
                                    </button>
                                </div>
                                <div className="col-12 col-md-12 tree">
                                    <div className="row">
                                        <div className="col-3">
                                            عنوان
                                            <input className="form-control" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                                        </div>
                                    </div>
                                    <TreeNode
                                        hideLabel={true}
                                        node={PermissionSet}
                                        path={null}
                                        checked={checked}
                                        onChange={handleCheckboxChange}
                                    />
                                    {/* <pre>{JSON.stringify(checked, null, 2)}</pre> */}
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default InActiveSystem;