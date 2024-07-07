import React, { useEffect, useState } from 'react';
import './style.scss'

import useRestrictionShowRequests from '../../../hooks/data/Restrictions/useRestrictionShowRequests';
import { NotificationController } from '../../../lib/notificationController';

const RestrictionShowRequests = () => {

    const [count, setCount] = useState<any>(null)
    const [type, setType] = useState<any>('select')


    const { result, state, refreshData } = useRestrictionShowRequests(type, 8, count);
    const pageTitle = 'تنظیم تاریخ نشان دادن درخواست ها'

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
        console.log(1, result);
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
                        setCount(parseInt(result.data[0].value))
                    }
                    break;
            }
        }
    }, [result])

    return (
        <div className='RestrictionShowRequests' >
            <div className="row">
                <div className="col-12">
                    <div className="page-title">
                        <i> {pageTitle}</i>
                    </div>
                </div>
            </div>

            <div className="row">

                <div className="col-6 flex-end">
                    <input value={count} onChange={(e) => setCount(e.target.value)} type='number' className='form-control count' />
                </div>
                <div className="col-6 flex-start">
                    <button onClick={() => handleclick()} className="btn btn-search" type="submit">ثبت</button>
                </div>
            </div>
        </div>
    );
};

export default RestrictionShowRequests;