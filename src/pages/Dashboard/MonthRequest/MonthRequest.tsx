import React, { useEffect, useState } from 'react';
import './style.scss'
import LineChart from '../../../components/Charts/LineChart/LineChart';
import { convertEnglishToPersianDigits, convertGregorianToJalali } from '../../../utils/utils';
import useRequests from '../../../hooks/data/useRequests';
import { MODE_AREAL } from '../../../lib/constants';
import { isArray } from 'lodash';

const MonthRequest = () => {



    const year = 1403
    const [monthIndex, setMonthindex] = useState<any>('1')
    const [chartData, setChartData] = useState<any>([])
    const [chartLable, setChartLable] = useState<any>([])

    const monthsInSolar = [
        'فروردین',
        'اردیبهشت',
        'خرداد',
        'تیر',
        'مرداد',
        'شهریور',
        'مهر',
        'آبان',
        'آذر',
        'دی',
        'بهمن',
        'اسفند'
    ];

    const { requests }: any = useRequests({
        mode: MODE_AREAL,
        initialParams: { status: '', paging: false },
    })

    useEffect(() => {
       // console.log(78, requests);
        let resCount: any = {}
        isArray(requests) && requests?.map((request: any) => {
            let date = convertGregorianToJalali(request?.gmt_for_date)
            resCount[date] = resCount[date] ? resCount[date] + 1 : 1
        })

      //  console.log(400, resCount)
        let myLable: any = []
        let myData: any = []

        for (let index = 1; index <= 30; index++) {
            let date = `${year}/${monthIndex < 10 ? `0${monthIndex}` : monthIndex}/${index < 10 ? `0${index}` : index}`
            myLable.push(convertEnglishToPersianDigits(date))
            myData.push(resCount[date])
           // console.log(404,date)
        }
       

        setChartData(myData)
        setChartLable(myLable)

    }, [requests,monthIndex])



    const data = {
        labels: chartLable,
        datasets: [
            {
                label: 'تعداد درخواست ',
                data: chartData,
                borderColor: '#633FD0', // رنگ خط نمودار
                backgroundColor: 'rgba(99, 63, 208, 0.2)', // رنگ سطح زیر خط
                borderWidth: 2,
                fill: true, // پر کردن فضای زیر خط
                pointBackgroundColor: '#8C72DD', // رنگ نقاط داده
            },
        ],
    };


    const [selectedMonth, setSelectedMonth] = useState(monthsInSolar[0]);

    const handleMonthChange = (event: any) => {
        setSelectedMonth(event.target.value);
        setMonthindex((monthsInSolar.indexOf(event.target.value)) + 1)
    };

    return (
        <div className='MonthRequest-component'>
            <div className="row">
                <div className="col-12">
                    <div className="title">
                        {`درخواست های ماهیانه`}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <select className='form-control my-select' value={selectedMonth} onChange={handleMonthChange}>
                        {monthsInSolar.map((month, index) => (
                            <option key={index} value={month}>
                                {`${month} ${year}`}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="chart">
                <div className="row">
                    <div className="col-12">
                        <div className="linechart">
                            <LineChart data={data} />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default MonthRequest;