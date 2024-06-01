import React, { useEffect, useState } from 'react';
import './style.scss'

import useSetWorkingWeek from '../../../hooks/data/Restrictions/useSetWorkingWeek';
import { NotificationController } from '../../../lib/notificationController';

const SetWorkingWeek = () => {




    const [type, setType] = useState<any>('select')
    const pageTitle = 'تنظیم هفته کاری'
    const daysOfWeek = [
        { name: 'Saturday', namefr: 'شنبه' },
        { name: 'Sunday', namefr: 'یکشنبه' },
        { name: 'Monday', namefr: 'دوشنبه' },
        { name: 'Tuesday', namefr: 'سه شنبه' },
        { name: 'Wednesday', namefr: 'چهارشنبه' },
        { name: 'Thursday', namefr: 'پنجشنبه' },
        { name: 'Friday', namefr: 'جمعه' },
    ];

    const [checkedDays, setCheckedDays] = useState<any>({
        Saturday: false,
        Sunday: false,
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
    });

    const { result, state, refreshData } = useSetWorkingWeek(type, 5, checkedDays);

    const handleCheckboxChange = (event: any) => {
        const { name, checked } = event.target;
        setCheckedDays((prevCheckedDays: any) => ({
            ...prevCheckedDays,
            [name]: checked,
        }));

        console.log(700, checkedDays);

    };

    const handleclick = () => {
        setType('insert')
    }

    const callRefresh = async () => {
        await refreshData()
    }
    useEffect(() => {
        callRefresh()
    }, [type])

    useEffect(() => {
        if (result && result.data) {
            switch (type) {
                case 'insert':
                    if (result.status === 200) {
                        NotificationController.showSuccess('اطلاعات ثبت شد');
                    }
                    else {
                        NotificationController.showError(result.status);
                    }
                    break;

                case 'select':
                    if (result && result.data[0]) {
                        setCheckedDays(result.data[0].value)
                    }
                    break;
            }
        }
    }, [result])


    return (
        <div className='SetWorkingWeek' >
            <div className="row">
                <div className="col-12">
                    <div className="page-title">
                        <i> {pageTitle}</i>
                    </div>
                </div>
            </div>

            <div className="row">

                <div className="col-6 flex-end days-div">
                    <div className="days">
                        {daysOfWeek.map((day) => (
                            <div key={day.name}>
                                <input
                                    type="checkbox"
                                    name={day.name}
                                    checked={checkedDays[day.name]}
                                    onChange={handleCheckboxChange}
                                />
                                <span> {day.namefr}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-6 flex-start">
                    <button onClick={() => handleclick()} className="btn btn-search" type="submit">ثبت</button>
                </div>
            </div>

        </div>
    );
};

export default SetWorkingWeek;