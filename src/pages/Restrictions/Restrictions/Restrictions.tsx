import React, { useState, useRef, useEffect } from 'react';
import httpService from '../../../old/services/httpService'
import { Box, Button, Center, Container, InputWrapper, Table, Text } from '@mantine/core';
import { TimeInput } from "@mantine/dates";
import { NumberInput } from '@mantine/core';
import './style.scss'
// import { Clock, Edit } from "tabler-icons-react";
import MyModal from '../../../old/component/common/modal';
import { ErrorToast, SucccessToast } from '../../../old/component/common/errorToast';
import useSWR from 'swr';
import { IsoToJalaliWithTime } from '../../../utils/dateTools';
import useRestrictions from '../../../hooks/data/Restrictions/useRestrictions';
import InActiveSystem from '../InActiveSystem/InActiveSystem';
import RestrictionShowRequests from '../RestrictionShowRequests/RestrictionShowRequests';
import SetWorkingWeek from '../SetWorkingWeek/SetWorkingWeek';
import ErrorBoundary from '../../../components/ErrorBoundary/ErrorBoundary';

const Restrictions = () => {

    const [type, setType] = useState<any>('select')
    const [key, setKey] = useState<any>(null)
    const [value, setValue] = useState<any>(null)
    const [refresh, setRefresh] = useState<boolean>(false)

    const { result, resultType, state, refreshData } = useRestrictions(refresh, type, key, value);
    const header = (
        <tr>
            <th className='text-center'></th>
            <th className='text-right'>عنوان</th>
            <th className='th-center text-center'>  مقدار فعلی </th>
            <th className='th-center text-center'>  واحد </th>
        </tr>
    );

    const [items, setItems] = useState<any>();
    const [showModal, setShowModal] = useState<any>(false);
    const [item, setItem] = useState<any>()


    useEffect(() => {
        // console.log(1, result);
        if (result && result.data) {
            //   console.log(300, result.data);
            if (resultType === 'select') {
                setItems(result.data)
            }
        }
    }, [result])

    const onEdit = (item: any) => {

        setItem(item)
        setShowModal(true)
    }

    const onRestrictionChange = (e: any, type: any) => {
        //   console.log(12, e.target.value, type);

        if (type === 'number') {
            item.value = e.target.value;
            setItem({ ...item })
        } else {
            item.value = IsoToJalaliWithTime(e.target.value.toISOString()).split(' ')[1];
            setItem({ ...item })
        }
    }


    const handleSubmit = async (item: any) => {
        try {
            const environmentName = import.meta.env.VITE_ENVIRONMENT_NAME;
            if (environmentName === "local") {
                setKey(item?.key)
                setValue(item?.value)
                setType('update')
                setRefresh(!refresh)
                // await httpService.post(`${import.meta.env.VITE_BASE_URL}/restriction`, { key: item?.key, value: item?.value });
                SucccessToast({ message: "محدودیت با موفقیت افزوده شد" })
                setShowModal(false);
                //mutateRestrictions()
            } else if (environmentName === "server") {
                setKey(item?.key)
                setValue(item?.value)
                setType('update')
                setRefresh(!refresh)
                // await httpService.post(`${import.meta.env.VITE_BASE_URL_SERVER}/restriction`, { key: item?.key, value: item?.value });
                SucccessToast({ message: "محدودیت با موفقیت افزوده شد" })
                setShowModal(false);
                // mutateRestrictions()
            }

        } catch (error) {
            ErrorToast({ message: "خطا در دریافت جزییات" });
        }
    }

    // useEffect(() => {
    //     setRestrictions(restrictionsList?.data?.docs);
    //     console.log(restrictionsList?.data?.docs);
    // }, [restrictionsList])

    const restrictions = [
        { title: " آخرین زمان ثبت درخواست روزانه", desc: "آخرین زمانی که کاربران برای روز جاری میتوانند درخواست خودرو کنند", value: '', key: 1, unit: 'ساعت ', type: 'time' },
        { title: " اولین زمان ثبت درخواست روزانه", desc: "اولین زمانی که کاربران برای روز جاری میتوانند درخواست خودرو کنند", value: '', key: 2, unit: 'ساعت ', type: 'time' },
        { title: "فاصله زمانی بین درخواست های یک کاربر", desc: " حداقل فاصله زمانی  بین دو درخواست متوالی یک کاربر در طول یک روز ", value: '', key: 3, unit: 'دقیقه ', type: 'number' },
        { title: "محدودیت زمانی درخواست لحظه ای", desc: "حداقل زمان قبل از ثبت درخواست لحظه ای", value: '', key: 4, unit: 'دقیقه ', type: 'number' },
        // { title: "محدودیت زمانی شروع پیش از موعد سفر توسط راننده", desc: "حداقل زمان قبل از ساعت سفر که رانندگان بتوانند سفر را آغاز نمایند ", value: '', key: 5, unit: 'دقیقه ', type: 'number' },
        { title: "حداکثر فاصله زمانی نسبت به زمان درخواست برای شروع سفر توسط راننده", desc: "حداکثر زمان بعد از ساعت سفر که رانندگان بتوانند سفر را آغاز نمایند ", value: '', key: 6, unit: 'دقیقه ', type: 'number' },
        { title: "غیر فعال کردن سیستم", desc: "غیر فعال کردن سیستم", value: '', key: 7, unit: 'روز', type: 'date' },
        { title: "محدودیت زمان نمایش درخواست ها", desc: "محدودیت زمان نمایش درخواست ها", value: '', key: 8, unit: 'روز', type: 'number' },
        { title: "تنظیم هفته کاری", desc: "تنظییم هفته کاری", value: '', key: 9, unit: 'روز', type: 'string' },
    ];

    const rows = restrictions?.map((element: any) => {
        //   console.log(444, items);

        return <>
            <tr key={element.name} className="table-row">
                <td>
                    <div className='clickable'>
                        <i onClick={() => onEdit(element)} className='fa fa-edit'></i>
                    </div>
                </td>
                <td style={{ textAlign: "right" }}>{element.title}</td>
                {element.key !== 9 && <td>{items?.find((x: any) => x?.key === element?.key)?.value || 'ثبت نشده'}</td>}
                {element.key === 9 && 'ثبت شده'}
                <td>{element?.unit}</td>
            </tr >
        </>

    })




    return (
        <div className="Restrictions-component">
            <div className="row">
                <div className="col-12">
                    <h1 className="my-4">محدودیت ها</h1>

                    <table>
                        <thead className='text-center'>{header}</thead>

                        <tbody className='text-center body-div'>{rows}</tbody>
                    </table>


                    {showModal === true &&

                        // <div className="modal show modal-div" id="myModal" aria-modal="true" role="dialog" style={{ display: 'block', paddingLeft: '0px', backgroundColor: 'rgb(0,0,0,0.8)' }}>
                        //     <div className="modal-dialog">
                        //         <div className="modal-content">


                        //             <div className="modal-header">
                        //                 <h4 className="modal-title">Modal Heading</h4>
                        //                 <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        //             </div>


                        //             <div className="modal-body">
                        //                 Modal body..
                        //             </div>


                        //             <div className="modal-footer">
                        //                 <button onClick={()=>setShowModal(false)} type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                        //             </div>

                        //         </div>
                        //     </div>
                        // </div>
                        <div className="modal-div">
                            <div className="modal show" id="myModal" aria-modal="true" role="dialog" style={{ display: 'block', paddingLeft: '0px', backgroundColor: 'rgb(0,0,0,0.8)' }}>
                                <div className={`modal-dialog modal-${'md'}`}>
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">{item?.title || 'Modal Heading'}</h5>
                                            <i className='fa fa-remove' onClick={() => {
                                                setShowModal(false);
                                                setItem(null);
                                            }}></i>
                                        </div>
                                        <div className="modal-body">

                                            {item && item?.key === 7 &&  <InActiveSystem /> }
                                            {item && item?.key === 8 &&  <RestrictionShowRequests /> }
                                            {item && item?.key === 9 &&  <SetWorkingWeek />  }
                                            {item && item?.key !== 7 && item?.key !== 8 && item?.key !== 9 &&
                                                <>   
                                                    <RenderModalBody onRestrictionChange={onRestrictionChange} item={item} />
                                                 
                                                    <div className="modal-footer">
                                                        <button type="button" className="my-btn btn-secondary" data-bs-dismiss="modal" onClick={() => {
                                                            setShowModal(false);
                                                            setItem(null);
                                                        }}>بستن</button>
                                                        {'save' && (
                                                            <button type="button" className={`my-btn btn-primary`} onClick={() => handleSubmit(item)}>
                                                                {'ذخیره'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </>
                                            }
                                        </div>

                                    </div>
                                </div>
                            </div>
                            {/* <MyModal
                                show={showModal}
                                title={item?.title || 'Modal Heading'}
                                onSave={() => handleSubmit(item)}
                                onHide={() => {
                                    setShowModal(false);
                                    setItem(null);
                                }}
                                saveButtonTitle="Save"
                                size="md"
                                body={item && <RenderModalBody onRestrictionChange={onRestrictionChange} item={item} />}
                            /> */}
                        </div>


                        // <MyModal
                        //     show={showModal}
                        //     title={item?.title}
                        //     onSave={() => handleSubmit(item)}
                        //     onHide={() => {
                        //         setShowModal(false)
                        //         setItem(null)
                        //     }}
                        //     saveButtonTitle="ذخیره"
                        //     size='md'
                        //     body={item && <RenderModalBody onRestrictionChange={onRestrictionChange} item={item} />}
                        // />
                    }
                </div>
            </div>
        </div>

    );
};

const RenderModalBody = ({ item, onRestrictionChange }: any) => {
    const { type, desc, value } = item;

    // if (type === 'time')
    //     return (
    //         <div className="inputWrapper" style={{ border: "none" }}>
    //             <label>{desc}</label>
    //             <i onChange={(e) => onRestrictionChange(e, type)} className='fa fa-clock-o'></i>
    //         </div>
    //     );
    // else
    if (1 === 1 || type === 'number')
        return (
            <div style={{ border: "none" }}>
                <label>{desc}</label>
                <input
                    className='form-control'
                    type="number"
                    name="numberInput"
                    id="numberInput"
                    onChange={(e) => onRestrictionChange(e, type)}
                    defaultValue={value}
                    placeholder={type === 'number' ? "30 دقیقه" : "12:12"}
                    step={1}
                />
            </div>
        );
    else return null;
};

export default Restrictions;