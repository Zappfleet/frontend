import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { gridLayer } from 'leaflet';
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ title, data }: any) => {
    // const data = {
    //     labels:  ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    //     datasets: [
    //         {
    //             label: 'Sales 2024',
    //             data: [65, 59, 80, 81, 56, 55, 40],
    //             backgroundColor: 'rgba(75, 192, 192, 0.6)',
    //             borderColor: 'rgba(75, 192, 192, 1)',
    //             borderWidth: 1,
    //         },
    //         {
    //             label: 'Sales 20243',
    //             data: [65, 59, 80, 81, 56, 55, 40],
    //             backgroundColor: 'rgba(75, 192, 192, 0.6)',
    //             borderColor: 'red',
    //             borderWidth: 1,
    //         }
    //     ],
    // };

    const options: any = {
        responsive: true,
        indexAxis: 'x', // جابجایی محور X و Y برای ایجاد نمودار افقی
        plugins: {
            legend: {
                position: 'bottom',
                rtl: true, // راست‌چین کردن لژیند
                textDirection: 'rtl', // تنظیم جهت متن برای لژیند
            },
            title: {
                display: false,
                text: title,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false, // غیر فعال کردن خطوط شبکه محور X
                },
                reverse: true, // معکوس کردن جهت مقادیر محور X

            },
            y: {
                grid: {
                    display: false, // غیر فعال کردن خطوط شبکه محور Y
                },
                position: 'right', // انتقال محور Y به سمت راست
            },
        },
    };



    return data &&  
        <Bar data={data} options={options} />;
      
};

export default BarChart;
