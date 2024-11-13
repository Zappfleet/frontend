import React, { useEffect, useState } from 'react';
import './style.scss';
import PieChart from '../../../components/Charts/PieChart/PieChart';
import { MODE_AREAL } from '../../../lib/constants';
import useRequests from '../../../hooks/data/useRequests';
import useRegions from '../../../hooks/data/useRegions';
import { concat, isArray } from 'lodash';
import ErrorBoundary from '../../../components/ErrorBoundary/ErrorBoundary';


const DarkhasthayeTafkikShode = () => {

    const [chartData, setChartData] = useState<any>([])
    const [chartLable, setChartLable] = useState<any>([])
    const items = ['محدوده', 'مرکز هزینه']
    const [activeItem, setActiveItem] = useState<any>('محدوده')

    const { requests }: any = useRequests({
        mode: MODE_AREAL,
        initialParams: { status: '', paging: false },
    })

    const { regions } = useRegions();

    useEffect(() => {

        // console.log(75, activeItem);

        let resCount: any = {}

        if (activeItem === 'محدوده') {
            isArray(requests) && requests?.map((request: any) => {
                let date: any = request?.area
                if (date) {
                    let id: any = date
                    resCount[id] = resCount[id] ? resCount[id] + 1 : 1
                }
            })
        }
        if (activeItem === 'مرکز هزینه') {
            console.log(7888);
            
            isArray(requests) && requests?.map((request: any) => {
                let date: any = request?.details?.cost_center_desc
                if (date) {
                    console.log(45,date);
                    
                    let id: any = date
                    resCount[id] = resCount[id] ? resCount[id] + 1 : 1
                }
            })
        }

        let myLable: any = []
        let myData: any = []
        Object.keys(resCount).map((ite: any) => {
            if (activeItem === 'محدوده') {
                let p: any = regions?.filter((r: any) => r._id === ite)[0]
                myLable.push((p?.name) ? p?.name : 'نامشخص')
            }
            else {
                myLable.push(ite)
            }
            myData.push(resCount[ite])
        })

       // console.log(41, myData, myLable);

        setChartData(myData)
        setChartLable(myLable)
    }, [requests, activeItem, regions])


    function getRandomColor() {
        // تولید یک رنگ تصادفی در فرمت hex
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    const backgroundColors = concat(['#8C72DD', '#52C8FD',], chartLable.map(() => getRandomColor())); // تولید رنگ‌های تصادفی برای هر فیلد
    const borderColors = backgroundColors; // استفاده از همان رنگ‌ها برای حاشیه

   // console.log(backgroundColors);

    const data: any = {
        labels: chartLable,//['فولاد مبارکه', 'اصفهان'],
        datasets: [
            {
                label: 'تعداد',
                data: chartData,//[23, 100],
                backgroundColor: backgroundColors, // رنگ‌های پس‌زمینه برای هر فیلد
                borderColor: borderColors, // رنگ‌های حاشیه برای هر فیلد
                // backgroundColor: [
                //     '#8C72DD',
                //     '#52C8FD',

                // ],
                // borderColor: [
                //     '#8C72DD',
                //     '#52C8FD',
                // ],
                borderWidth: 1,
            },
        ],
    };



    const listItems = () => {
        let result = items.map((item: any, index: any) => {
            return <span key={index} onClick={() => setActiveItem(item)} className={`my-span ${activeItem === item ? 'active' : ''}`}>{item}</span>
        })
        return result
    }

    return (
        <div className='DarkhasthayeTafkikShode-component'>
            <div className="row">
                <div className="col-12">
                    <div className="title">
                        {`درخواست های تفکیک شده`}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="list">
                        {listItems()}
                    </div>
                </div>
            </div>
            <div className="chart">
                <div className="row">
                    <div className="col-12">
                        <div className="piechart">

                            <PieChart data={data} />


                        </div>

                    </div>
                </div>
            </div>

        </div>
    );

};

export default DarkhasthayeTafkikShode;
