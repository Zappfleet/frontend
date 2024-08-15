import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend,Filler } from 'chart.js';

// Register the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend,Filler);

const LineChart = ({ data }: any) => {
    // const data = {
    //     labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    //     datasets: [
    //         {
    //             label: 'Sales 2024',
    //             data: [65, 59, 80, 81, 56, 55, 40],
    //             borderColor: 'rgba(75, 192, 192, 1)',
    //             backgroundColor: 'rgba(75, 192, 192, 0.2)',
    //             borderWidth: 2,
    //             fill: true, // تنظیم برای پر کردن فضای زیر خط
    //             pointBackgroundColor: 'rgba(75, 192, 192, 1)', // رنگ نقاط داده
    //         },
    //     ],
    // };

    const options: any = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem: any) {
                        return `Value: ${tooltipItem.raw}`;
                    },
                },
            },
            title: {
                display: false,
                text: 'Sales Over Months',
            },
        },
        scales: {
            x: {
                grid: {
                    display: false, // غیر فعال کردن خطوط شبکه محور Y
                },
                title: {
                    display: false,
                    text: 'Month',
                },
            },
            y: {
                title: {
                    display: false,
                    text: 'تعداد درخواست',
                },
                ticks: {
                    beginAtZero: true,
                },
            },
        },
    };

    return <Line data={data} options={options} />;
};

export default LineChart;
