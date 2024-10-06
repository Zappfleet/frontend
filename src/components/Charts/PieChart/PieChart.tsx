import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ title, data }: any) => {
    const options: any = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
                rtl: true, // راست‌چین کردن لژیند
                textDirection: 'rtl', // تنظیم جهت متن برای لژیند
            },
            title: {
                display: false,
                text: { title },
            },
        },
    };

    return data &&  
        <Pie data={data} options={options} />;
      
};

export default PieChart;